export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 Bytes'

	const k = 1024
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

	// Math.floor(Math.log(bytes) / Math.log(k)) determines which unit bucket the size falls into
	const i = Math.floor(Math.log(bytes) / Math.log(k))

	// Cap the index to the maximum unit available in the array
	const index = Math.min(i, sizes.length - 1)

	// Parse float and fix to 2 decimal places, but remove trailing zeros if they aren't needed
	const formattedSize = parseFloat((bytes / Math.pow(k, index)).toFixed(2))

	return `${formattedSize} ${sizes[index]}`
}
