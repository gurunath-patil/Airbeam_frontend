import Connector from '@/lib/connector'
import './App.css'
import { senderReceiver } from '@/services/base.service'
import { useRef, useState } from 'react'

function App() {
	const [senderConnectorRef, setSenderConnectorRef] = useState<Connector | undefined>(undefined)
	const inputRef = useRef(null)
	async function handleSend() {
		inputRef.current?.click()

		const senderConnector = new Connector('SENDER')
		setSenderConnectorRef(senderConnector)
		try {
			const receiverList = await senderReceiver.get("/?role=RECEIVER")
			if (!receiverList || receiverList.length === 0) {
				console.error("No active receivers found!")
				alert("No active receivers found! Please open a receiver first.")
				return
			}
			senderConnector.registerInSocket()
			senderConnector.setReceiverChannel(receiverList[0]?.channel_name)
			senderConnector.sendMyChannelname()

			await senderConnector.createSDPOffer()
		} catch (error) {
			console.error("Failed to initiate connection:", error)
		}
	}

	function handleFileChange() {
		const files = inputRef.current?.files
		if (files && files.length > 0) {
			for (const file of files) {
				senderConnectorRef?.sendFiles(file)
			}
		}else{
			console.error("No files selected")
		}
	}

	async function handleReceive() {
		const receiverConnector = new Connector('RECEIVER')
		receiverConnector.registerInSocket()
	}

	return (
		<div className='flex gap-x-5 px-3 py-5'>
			<button className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg' onClick={handleSend}>Send</button>
			<input type="file" ref={inputRef} style={{display:'none'}} multiple onChange={handleFileChange}/>
			<button className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg' onClick={handleReceive}>Receive</button>
		</div>
	)
}

export default App
