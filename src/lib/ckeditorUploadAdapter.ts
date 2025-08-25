// utils/ckeditorUploadAdapter.ts
import axios from "axios";
import BackendUrl from "@/app/api/BackendUrl";

export default class UploadAdapter {
  loader: any;
  url: string;

  constructor(loader: any) {
    this.loader = loader;
    this.url = `${BackendUrl}/uploads`; // 👈 your backend upload endpoint
  }

  async upload() {
    const data = new FormData();
    const file = await this.loader.file;
    data.append("file", file);

    const res = await axios.post(this.url, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // CKEditor expects { default: "url-to-image" }
    return { default: res.data.url };
  }

  abort() {}
}
