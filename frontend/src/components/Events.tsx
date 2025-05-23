import React from 'react';
import { Event } from '../types';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

interface EventsProps {
  events: Event[];
}

const Events: React.FC<EventsProps> = ({ events }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Upcoming <span className="text-purple-500">Events</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Join us for exclusive underground events, live performances, and community gatherings.
          Experience the void in person.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event.id}
            className="group bg-gray-900 rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-200">
                {event.title}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-400">
                  <Calendar size={16} className="mr-2" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Clock size={16} className="mr-2" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin size={16} className="mr-2" />
                  <span>{event.venue}</span>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                {event.description}
              </p>

              <a
                href={event.ticketLink}
                className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors duration-200"
              >
                <span>Get Tickets</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Events;