import { useState } from 'react'
import { SendHorizontal, Search } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import useSearch from '@/hooks/useSearch'
import { conversations } from '@/data/messages'

export default function InboxPage() {
    const [selectedId, setSelectedId] = useState(conversations[0]?.id ?? '')
    const [draft, setDraft] = useState('')

    const search = useSearch(conversations, (conversation, normalizedQuery) =>
        conversation.senderName.toLowerCase().includes(normalizedQuery) ||
        conversation.preview.toLowerCase().includes(normalizedQuery)
    )

    const filtered = search.filtered

    const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0]

    return (
        <div>
            <PageHeader title="Inbox" breadcrumb="GymHub / Inbox" />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 h-[calc(100vh-170px)]">
                <Card className="xl:col-span-4 flex flex-col">
                    <CardContent className="p-4 border-b">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search messages"
                                className="pl-9"
                                value={search.query}
                                onChange={(e) => search.setQuery(e.target.value)}
                            />
                        </div>
                    </CardContent>

                    <CardContent className="p-2 flex-1 overflow-auto">
                        <div className="space-y-1">
                            {filtered.map((conversation) => (
                                <button
                                    key={conversation.id}
                                    onClick={() => setSelectedId(conversation.id)}
                                    className={`
                    w-full text-left p-3 rounded-lg transition-colors
                    ${selected?.id === conversation.id ? 'bg-primary/10' : 'hover:bg-muted/50'}
                  `}
                                >
                                    <div className="flex items-start gap-2.5">
                                        <Avatar className="w-9 h-9">
                                            <AvatarImage src={conversation.senderAvatar} />
                                            <AvatarFallback>{conversation.senderName.slice(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-0.5">
                                                <p className="font-medium text-sm truncate">{conversation.senderName}</p>
                                                <span className="text-[11px] text-muted-foreground shrink-0">{conversation.timestamp}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">{conversation.preview}</p>
                                        </div>
                                        {conversation.unread && <span className="w-2 h-2 rounded-full bg-primary mt-2" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="xl:col-span-8 flex flex-col">
                    {selected ? (
                        <>
                            <CardContent className="p-4 border-b">
                                <div className="flex items-center gap-2.5">
                                    <Avatar className="w-9 h-9">
                                        <AvatarImage src={selected.senderAvatar} />
                                        <AvatarFallback>{selected.senderName.slice(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-sm">{selected.senderName}</p>
                                        <p className="text-xs text-muted-foreground">Active now</p>
                                    </div>
                                </div>
                            </CardContent>

                            <CardContent className="flex-1 overflow-auto p-4 space-y-3">
                                {selected.thread.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`
                        max-w-[75%] rounded-2xl px-3 py-2 text-sm
                        ${message.isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                      `}
                                        >
                                            <p>{message.content}</p>
                                            <p className={`text-[11px] mt-1 ${message.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                                {message.timestamp}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>

                            <CardContent className="p-4 border-t">
                                <div className="flex gap-2">
                                    <Input
                                        value={draft}
                                        onChange={(e) => setDraft(e.target.value)}
                                        placeholder="Type a message..."
                                    />
                                    <Button type="button" className="shrink-0">
                                        <SendHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </>
                    ) : (
                        <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
                            Select a conversation
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    )
}
