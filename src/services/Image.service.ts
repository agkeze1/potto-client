import axios from "axios";
import { uploadBaseUrl, uploadPreset } from "../data/app.json";

class ImageService {
	/**
	 * Upload a single
	 * @param id user id
	 * @param file File to upload
	 */
	async Upload(file: File) {
		if (file) {
			let fd = new FormData();
			fd.append("file", file);
			fd.append("upload_preset", uploadPreset);
			// Fetch
			const result = await axios({
				url: uploadBaseUrl,
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				data: fd
			});
			if (result.status === 200) return result.data.secure_url;
		}
		throw new Error("File or/and identifier not found!");
	}
}
export const imageService = new ImageService();
