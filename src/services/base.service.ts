import type { IUserList } from "@/models/connector"

export default class BaseService<T> {
	baseUrl: string = ''

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl
	}

	async get(url: string = this.baseUrl): Promise<T> {
		const response = await fetch(url)

		if (!response.ok) {
			throw new Error(response.statusText)
		}

		return response.json()
	}

	async post(url: string = this.baseUrl, body: unknown): Promise<T> {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		if (!response.ok) {
			throw new Error(response.statusText)
		}

		return response.json()
	}

	async put(url: string= this.baseUrl, body: unknown): Promise<T> {
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		if (!response.ok) {
			throw new Error(response.statusText)
		}

		return response.json()
	}

	async patch(url: string = this.baseUrl, body: unknown): Promise<T> {
		const response = await fetch(url, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		if (!response.ok) {
			throw new Error(response.statusText)
		}

		return response.json()
	}

	async delete(url: string= this.baseUrl): Promise<T> {
		const response = await fetch(url, {
			method: 'DELETE',
		})

		if (!response.ok) {
			throw new Error(response.statusText)
		}

		return response.json()
	}
}

const httpBaseUrl = import.meta.env.VITE_HTTP_BASE_URL
export const senderReceiver = new BaseService<IUserList[]>(httpBaseUrl+"users/active_user/")
