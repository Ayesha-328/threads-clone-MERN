import {
  InputGroup,
  Input,
  InputRightElement,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
  useDisclosure,
  Spinner
} from '@chakra-ui/react'
import { useState, useRef } from 'react'
import { IoSendSharp } from 'react-icons/io5'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from 'recoil'
import conversationsAtom, { selectedConversationAtom } from '../atoms/messagesAtom'
import { BsFillImageFill } from 'react-icons/bs'
import usePreviewImg from '../hooks/usePreviewImg'


const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("")
  const showToast = useShowToast()
  const selectedConversation = useRecoilValue(selectedConversationAtom)
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const imageRef = useRef(null)
  const { onClose } = useDisclosure()
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg()
  const [isSending, setIsSending] = useState(false)
  const apiUrl = import.meta.env.VITE_API_URL;


  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageText && !imgUrl) return
    if (isSending) return

    setIsSending(true)
    try {
      const res = await fetch(`${apiUrl}/messages/`, {
        method: "POST",
        credentials: "include", // This will send cookies with the request
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId,
          img:imgUrl
        })
      })
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error", 5000)
        return
      }

      setMessages(prev => [...prev, data])

      setConversations(prevConvs => {
        const updatedConvs = prevConvs.map(conversation => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender
              }
            }
          }
          return conversation;
        })
        return updatedConvs
      })
      setMessageText("")
      setImgUrl("")
    } catch (error) {
      showToast("Error", error.message, "error", 5000)
    } finally {
      setIsSending(false)
    }

  }

  return (
    <Flex gap={2} alignItems={'center'}>

      <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
        <InputGroup>
          <Input
            name="messageText"
            value={messageText}
            w={'full'}
            placeholder='Type a message...'
            onChange={(e) => setMessageText(e.target.value)}
          />
          <InputRightElement onClick={handleSendMessage} cursor={'pointer'}>
            <IoSendSharp />
          </InputRightElement>
        </InputGroup>
      </form>
      <Flex flex={5} cursor={'pointer'}>
        <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
        <Input type='file' hidden ref={imageRef} onChange={handleImageChange} />
      </Flex>
      <Modal isOpen={imgUrl} onClose={() => {
        onClose()
        setImgUrl("")
      }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={5} w={'full'}>
              <Image src={imgUrl} />
            </Flex>

            <Flex justifyContent={'flex-end'} my={2}>
              {isSending ? (
                <Spinner size={'md'} />
              ) : (
                <IoSendSharp size={24} cursor={'pointer'} onClick={handleSendMessage} />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default MessageInput