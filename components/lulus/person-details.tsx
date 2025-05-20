import Image from 'next/image';
import { Calendar, Coffee, Heart, Mail, Phone, Star } from 'lucide-react';
import { Person } from './types';

interface PersonDetailsProps {
  person: Person;
}

const PersonDetails = ({ person }: PersonDetailsProps) => (
  <div className="grid gap-6">
    <div className="flex items-center gap-6">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 to-amber-500 flex items-center justify-center">
        <Image
          src={person.picture ?? ''}
          alt={person.name}
          className="w-24 h-24 rounded-full"
          width={96}
          height={96}
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-rose-800">{person.name}</h2>
        <div className="flex items-center mt-1">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(person.date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
          })}
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
      <p>
        <span className="font-medium">Shirt Size:</span> {person.shirt_size}
      </p>
      <p>
        <span className="font-medium">Shoe Size:</span> {person.shoe_size}
      </p>
      <p>
        <span className="font-medium">Allergies:</span> {person.allergies}
      </p>
    </div>

    {/* <div className="flex items-center justify-between bg-amber-50 p-4 rounded-lg">
      <Gift className="w-6 h-6 text-amber-600" />
      <ArrowRight className="w-6 h-6 text-amber-600" />
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-400 to-rose-500 flex items-center justify-center">
          <Image
            src={getGivesToPicture(person.gives_to_id).picture ?? ''}
            alt={getGivesToPicture(person.gives_to_id).name}
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
    </div> */}
  </div>
);

export default PersonDetails;
