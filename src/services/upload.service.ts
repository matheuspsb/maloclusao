import { api } from "./api"

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData()
  form.append("file", file)
  const { data } = await api.post<{ data: { url: string } }>("/upload/image", form, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return data.data.url
}
