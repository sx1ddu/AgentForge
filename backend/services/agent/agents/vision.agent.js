import { getModel } from "../config/llmmodels.js";
import axios from "axios";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { deductCredits, refundCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const visionAgent = async (state) => {
  let creditDeducted = false;
  try {
    await checkAgentLimit(state.userId, "vision");
    await deductCredits(state.userId, "vision");
    creditDeducted = true;

    const llm = await getModel("router");
    const res = await llm.invoke(`
Convert this into a clear, vivid image generation prompt (maximum 20 words). Only return the prompt without quotes.

${state.prompt}
`);

    const promptText = typeof res.content === "string" ? res.content.trim() : state.prompt;
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      promptText
    )}?width=1024&height=1024&nologo=true&seed=${seed}`;

    let imageRes;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        imageRes = await axios.get(imageUrl, {
          responseType: "arraybuffer",
          timeout: 30000,
        });
        break;
      } catch (err) {
        console.warn(`Pollinations image attempt ${attempt + 1} failed:`, err.message);
        if (attempt === 2) throw err;
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    const contentType = imageRes.headers["content-type"]?.split(";")[0] || "image/png";
    const extension = contentType === "image/jpeg" ? "jpg" : "png";
    const filename = `image-${Date.now()}-${seed}.${extension}`;

    await uploadToS3(filename, Buffer.from(imageRes.data), contentType);
    const downloadUrl = await getFromS3(filename, 24 * 60 * 60);

    return {
      ...state,
      images: [downloadUrl],
      aiResponse: `![Generated Image](${downloadUrl})

📥 [Download Full-Resolution Image](${downloadUrl})

*Link is valid for 24 hours.*`,
    };
  } catch (error) {
    console.error("Vision Agent Error:", error);
    if (creditDeducted) {
      await refundCredits(state.userId, "vision");
    }

    return {
      ...state,
      aiResponse: error?.data?.message || "Image generation service is currently unavailable. Please try again later.",
    };
  }
};
