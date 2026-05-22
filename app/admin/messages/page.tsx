"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Mail } from "lucide-react"
import { toast } from "sonner"

interface Message {
  id: number
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  created_at: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/admin/messages")
      const result = await response.json()
      if (result.success && result.data) {
        setMessages(result.data)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch messages:", error)
      toast.error("Failed to load messages")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedMessage = messages.find((m) => m.id === selectedId)

  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      const result = await response.json()
      if (result.success) {
        setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)))
      }
    } catch (error) {
      console.error("[v0] Failed to mark as read:", error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/messages?id=${id}`, {
        method: "DELETE",
      })

      const result = await response.json()
      if (result.success) {
        setMessages(messages.filter((m) => m.id !== id))
        if (selectedId === id) setSelectedId(null)
        toast.success("Message deleted successfully")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("[v0] Failed to delete message:", error)
      toast.error("Failed to delete message")
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-foreground/70">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-foreground/70">
          {unreadCount > 0
            ? `You have ${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}`
            : "All messages read"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <div className="space-y-2">
            {messages.length === 0 ? (
              <Card className="p-6 text-center text-foreground/70">
                <Mail size={32} className="mx-auto mb-2 opacity-50" />
                <p>No messages yet</p>
              </Card>
            ) : (
              messages.map((msg) => (
                <Card
                  key={msg.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedId === msg.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted " + (msg.read ? "" : "border-l-4 border-l-primary")
                  }`}
                  onClick={() => {
                    setSelectedId(msg.id)
                    if (!msg.read) handleMarkAsRead(msg.id)
                  }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-sm truncate">{msg.name}</h3>
                    {!msg.read && (
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs opacity-75 truncate">{msg.subject}</p>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{selectedMessage.subject}</h2>
                <div className="space-y-1 text-sm text-foreground/70">
                  <p>
                    <span className="font-medium">From:</span> {selectedMessage.name} ({selectedMessage.email})
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(selectedMessage.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="bg-muted p-6 rounded-lg mb-6">
                <p className="text-foreground/80 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="flex gap-3">
                <a href={`mailto:${selectedMessage.email}`}>
                  <Button>
                    <Mail size={16} className="mr-2" />
                    Reply
                  </Button>
                </a>
                <Button variant="destructive" onClick={() => handleDelete(selectedMessage.id)}>
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center text-foreground/70">
              <Mail size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a message to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
