'use client';
import { useState } from 'react';

import Image from 'next/image';

import { ArrowRight, Calendar, Coffee, Filter, Gift, Heart, Mail, Phone, Search, SortAsc, Star } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { filteredAndSortedParticipants, months } from './utils';


export interface Person {
  id: number;
    name: string;
    date: string;
    month: string;
    gives_to: string;
    gives_to_id: number;
    favorite_color: string;
    hobbies: string;
    email?: string;
    phone?: string;
    preferences?: string;
    shirt_size?: string;
    shoe_size?: string;
    allergies?: string;
}

interface PersonDetailsProps {
    person: Person;
}

const PersonDetails = ({ person }: PersonDetailsProps) => (
    <div className="grid gap-6">
       
        <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 to-amber-500 flex items-center justify-center">
                <Image
                    src={`/api/placeholder/96/96`}
                    alt={person.name}
                    className="w-24 h-24 rounded-full"
                    width={96}
                    height={96}
                />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-rose-800">{person.name}</h2>
                <div className="flex items-center text-gray-600 mt-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    {person.date}
                </div>
            </div>
        </div>

       
        <div className="grid gap-3 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-600" />
                <span>{person.email}</span>
            </div>
            <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-600" />
                <span>{person.phone}</span>
            </div>
        </div>

       
        <div className="grid gap-4">
            <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600" />
                <span className="font-medium">Favorite Color:</span> 
                <span>{person.favorite_color}</span>
            </div>
            <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-rose-600" />
                <span className="font-medium">Hobbies:</span> 
                <span>{person.hobbies}</span>
            </div>
            <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-rose-600" />
                <span className="font-medium">Gift Preferences:</span> 
                <span>{person.preferences}</span>
            </div>
        </div>

       
        <div className="grid gap-2 bg-gray-50 p-4 rounded-lg">
            <p><span className="font-medium">Shirt Size:</span> {person.shirt_size}</p>
            <p><span className="font-medium">Shoe Size:</span> {person.shoe_size}</p>
            <p><span className="font-medium">Allergies:</span> {person.allergies}</p>
        </div>

       
        <div className="flex items-center justify-between bg-amber-50 p-4 rounded-lg">
            <Gift className="w-6 h-6 text-amber-600" />
            <ArrowRight className="w-6 h-6 text-amber-600" />
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-400 to-rose-500 flex items-center justify-center">
                    <Image
                        src={`/api/placeholder/64/64`}
                        alt={person.gives_to}
                        className="w-16 h-16 rounded-full"
                           width={64}
                    height={64}
                    />
                </div>
                <div className="text-right">
                    <p className="font-medium text-rose-800">Gives to:</p>
                    <p className="text-rose-600 text-lg">{person.gives_to}</p>
                </div>
            </div>
        </div>
    </div>
);

// Main component
const SecretSantaPage = () => {
    // State management
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [filterMonth, setFilterMonth] = useState('all');

   



    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 via-amber-100 to-violet-100 p-8">
            <div className="max-w-6xl mx-auto">
               
                <h1 className="text-4xl font-bold text-center mb-8 text-rose-600 animate-fade-in">
                    Luluzinha 2025
                </h1>

               
                <div className="bg-white/80 backdrop-blur rounded-lg p-4 mb-8 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                       
                        <div className="flex items-center gap-2">
                            <SortAsc className="h-4 w-4 text-gray-400" />
                            <select
                                className="w-full p-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="date">Sort by Date</option>
                                <option value="name">Sort by Name</option>
                                <option value="gives_to">Sort by Gift Recipient</option>
                            </select>
                        </div>

                       
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <select
                                className="w-full p-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                value={filterMonth}
                                onChange={(e) => setFilterMonth(e.target.value)}
                            >
                                <option value="all">All Months</option>
                                {months.map(month => (
                                    <option key={month.value} value={month.value}>
                                        {month.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

               
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
                    {filteredAndSortedParticipants( searchTerm, filterMonth, sortBy).map((participant) => (
                        <Dialog key={participant.id}>
                            <DialogTrigger asChild>
                                <Card className="bg-white/90 backdrop-blur hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col gap-4">
                                           
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-amber-500 flex items-center justify-center">
                                                        <Image
                                                            src={`/api/placeholder/64/64`}
                                                            alt={participant.name}
                                                            className="w-16 h-16 rounded-full"
                                                            width={64}
                    height={64}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h2 className="font-semibold text-xl text-rose-800">
                                                            {participant.name}
                                                        </h2>
                                                        <div className="flex items-center text-gray-600 text-sm">
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            {participant.date}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                           
                                            <div className="border-t border-b border-gray-100 py-3">
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Favorite Color:</span> {participant.favorite_color}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    <span className="font-medium">Hobbies:</span> {participant.hobbies}
                                                </p>
                                            </div>

                                           
                                            <div className="flex items-center justify-between bg-amber-50 p-3 rounded-lg">
                                                <Gift className="w-5 h-5 text-amber-600" />
                                                <ArrowRight className="w-5 h-5 text-amber-600" />
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-rose-500 flex items-center justify-center">
                                                        <Image
                                                            src={`/api/placeholder/48/48`}
                                                            alt={participant.gives_to}
                                                            className="w-12 h-12 rounded-full"
                                                            width={48}
                    height={48}
                                                        />
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium text-rose-800">Responsável</p>
                                                        <p className="text-rose-600">{participant.gives_to}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Participant Details</DialogTitle>
                                </DialogHeader>
                                <PersonDetails 
                                    person={participant}
                                    // recipient={participants.find(p => p.id === participant.gives_to_id)}
                                />
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>

               
                {filteredAndSortedParticipants.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No participants found matching your search criteria.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SecretSantaPage;
