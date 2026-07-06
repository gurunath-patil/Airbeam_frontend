import type { IUserList } from "@/models/connector"

export default class BaseService<T> {
	baseUrl: string = ''

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl
	}

	async get(url: string): Promise<T> {
		const response = await fetch(`${this.baseUrl}${url}`)

		if (!response.ok) {
			throw new Error(response.statusText)
		}

		return response.json()
	}

	async post(url: string, body: unknown): Promise<T> {
		const response = await fetch(`${this.baseUrl}${url}`, {
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

	async put(url: string, body: unknown): Promise<T> {
		const response = await fetch(`${this.baseUrl}${url}`, {
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

	async patch(url: string, body: unknown): Promise<T> {
		const response = await fetch(`${this.baseUrl}${url}`, {
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

	async delete(url: string): Promise<T> {
		const response = await fetch(`${this.baseUrl}${url}`, {
			method: 'DELETE',
		})

		if (!response.ok) {
			throw new Error(response.statusText)
		}

		return response.json()
	}
}

const httpBaseUrl = import.meta.env.VITE_HTTP_BASE_URL
export const senderReceiver = new BaseService<IUserList[]>(httpBaseUrl+"users/active_user")
