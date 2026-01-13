import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { Plus, Trash2, Search, StickyNote, Star, ArrowRight } from 'lucide-react';
import { useStorage } from '../context/StorageContext';

interface NotesProps {
    onNavigateToPricing: () => void;
}

export const Notes: React.FC<NotesProps> = ({ onNavigateToPricing }) => {
    const { data, updateNotes, deleteNote: removeNoteFromDB } = useStorage();
    const isPremium = data.userProfile?.tier === 'premium';
    const notes = data.notes;

    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Local state for editing (saves only on blur)
    const [localTitle, setLocalTitle] = useState('');
    const [localContent, setLocalContent] = useState('');

    const activeNote = notes.find(n => n.id === activeNoteId);

    // Sync local state when active note changes
    useEffect(() => {
        if (activeNote) {
            setLocalTitle(activeNote.title);
            setLocalContent(activeNote.content);
        }
    }, [activeNoteId, activeNote?.id]);

    const addNote = () => {
        const newNote: Note = {
            id: Date.now().toString(),
            title: 'New Note',
            content: '',
            createdAt: new Date().toISOString()
        };
        updateNotes([newNote, ...notes]);
        setActiveNoteId(newNote.id);
    };

    const deleteNote = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const remainingNotes = notes.filter(n => n.id !== id);
        await removeNoteFromDB(id);
        await updateNotes(remainingNotes);
        if (activeNoteId === id) setActiveNoteId(null);
    };

    // Save on blur instead of on change
    const handleTitleBlur = () => {
        if (activeNote && localTitle !== activeNote.title) {
            updateNotes(notes.map(n => n.id === activeNote.id ? { ...n, title: localTitle } : n));
        }
    };

    const handleContentBlur = () => {
        if (activeNote && localContent !== activeNote.content) {
            updateNotes(notes.map(n => n.id === activeNote.id ? { ...n, content: localContent } : n));
        }
    };

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative">
            <div className={`h-[calc(100vh-8rem)] flex bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in duration-300 ${!isPremium ? 'blur-md pointer-events-none select-none' : ''}`}>


                <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 flex flex-col bg-slate-50 dark:bg-slate-900/50">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-700 dark:text-slate-200">Notes</h2>
                            <button onClick={addNote} className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search notes..."
                                className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredNotes.map(note => (
                            <div
                                key={note.id}
                                onClick={() => setActiveNoteId(note.id)}
                                className={`p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer transition-colors group ${activeNoteId === note.id ? 'bg-white dark:bg-slate-800 border-l-4 border-l-green-500' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className={`font-medium truncate ${activeNoteId === note.id ? 'text-green-700 dark:text-green-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {note.title || 'Untitled'}
                                    </h3>
                                    <button onClick={(e) => deleteNote(e, note.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 truncate">
                                    {note.content || 'No content'}
                                </p>
                                <span className="text-[10px] text-slate-400 mt-2 block">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                        {filteredNotes.length === 0 && (
                            <div className="p-8 text-center text-slate-400 text-sm">
                                No notes found
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-white dark:bg-slate-800">
                    {activeNote ? (
                        <>
                            <input
                                type="text"
                                value={localTitle}
                                onChange={(e) => setLocalTitle(e.target.value)}
                                onBlur={handleTitleBlur}
                                className="p-6 text-2xl font-bold bg-transparent border-b border-slate-100 dark:border-slate-700 focus:outline-none text-slate-800 dark:text-slate-100"
                                placeholder="Note Title"
                            />
                            <textarea
                                value={localContent}
                                onChange={(e) => setLocalContent(e.target.value)}
                                onBlur={handleContentBlur}
                                className="flex-1 p-6 resize-none focus:outline-none bg-transparent text-slate-700 dark:text-slate-300 leading-relaxed"
                                placeholder="Start typing..."
                            />
                        </>

                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400">
                            <div className="text-center">
                                <StickyNote size={48} className="mx-auto mb-4 opacity-20" />
                                <p>Select a note or create a new one</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {!isPremium && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-50/10 dark:bg-slate-950/10 backdrop-blur-[2px]">
                    <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-lg shadow-green-500/20">
                            <StickyNote size={40} fill="currentColor" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Personal Notes</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                Take your productivity to the next level with unlimited personal notes and cloud sync.
                            </p>
                        </div>
                        <div className="space-y-4 pt-2">
                            <button
                                onClick={onNavigateToPricing}
                                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 group"
                            >
                                Upgrade to Pro
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-xs text-slate-400 font-medium">Keep your thoughts organized in the cloud</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};