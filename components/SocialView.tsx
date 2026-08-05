
import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Camera } from 'lucide-react';

const STORIES = [
  { id: 1, name: 'Patanegra', image: 'https://i.imgur.com/hm4KO4J_d.webp?maxwidth=760&fidelity=grand', active: true },
  { id: 2, name: 'Bastidores', image: 'https://images.unsplash.com/photo-1571705042748-55fdee1cf87b?auto=format&fit=crop&q=80&w=150', active: true },
  { id: 3, name: 'Eventos', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=150', active: true },
  { id: 4, name: 'Harmoniza', image: 'https://images.unsplash.com/photo-1566733971257-826502945d58?auto=format&fit=crop&q=80&w=150', active: false },
  { id: 5, name: 'Delivery', image: 'https://images.unsplash.com/photo-1526367790999-0150786486a9?auto=format&fit=crop&q=80&w=150', active: false },
];

const POSTS = [
  {
    id: 1,
    user: 'Patanegra Premium',
    location: 'Foz do Iguaçu, Brazil',
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80&w=1000',
    likes: 124,
    caption: 'O final de semana pede a nossa Session IPA. Leve, cítrica e extremamente refrescante. 🍻🔥',
    time: 'Há 2 horas'
  },
  {
    id: 2,
    user: 'Patanegra Premium',
    location: 'Marechal Cândido Rondon',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1000',
    likes: 89,
    caption: 'Instalação completa para o evento de hoje! Tonel Patanegra trazendo elegância para o bar. #ChoppPatanegra #EventosPremium',
    time: 'Há 5 horas'
  },
  {
    id: 3,
    user: 'Patanegra Premium',
    location: 'Cervejaria Patanegra',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=1000',
    likes: 256,
    caption: 'Nosso mestre cervejeiro verificando a Hefe Weiss diretamente do tanque. O frescor que você sente no seu growler começa aqui. 🥨🌾',
    time: 'Há 1 dia'
  }
];

export const SocialView: React.FC = () => {
  return (
    <div className="animate-fade-in pb-24 h-screen flex flex-col bg-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-900 sticky top-0 bg-zinc-950/95 backdrop-blur-md z-30">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 p-1">
              <img src="https://i.imgur.com/hm4KO4J_d.webp?maxwidth=760&fidelity=grand" className="w-full h-full object-contain" />
           </div>
           <h1 className="font-serif text-xl font-bold text-white tracking-tight">Patanegra Feed</h1>
        </div>
        <div className="flex items-center gap-5 text-zinc-300">
           <Heart size={24} />
           <MessageCircle size={24} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Stories Section */}
        <div className="flex overflow-x-auto gap-4 px-4 py-4 border-b border-zinc-900 scrollbar-hide">
          {STORIES.map(story => (
            <div key={story.id} className="flex flex-col items-center gap-1 flex-shrink-0">
               <div className={`p-[2px] rounded-full ${story.active ? 'bg-gradient-to-tr from-amber-600 to-amber-300' : 'bg-zinc-800'}`}>
                  <div className="bg-zinc-950 p-[2px] rounded-full">
                    <img 
                      src={story.image} 
                      className="w-16 h-16 rounded-full object-cover grayscale-[20%]" 
                      alt={story.name} 
                    />
                  </div>
               </div>
               <span className="text-[10px] text-zinc-400 font-medium">{story.name}</span>
            </div>
          ))}
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {POSTS.map(post => (
            <div key={post.id} className="bg-zinc-950">
               {/* Post Header */}
               <div className="flex items-center justify-between px-3 py-3">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden">
                        <img src="https://i.imgur.com/hm4KO4J_d.webp?maxwidth=760&fidelity=grand" className="w-full h-full object-contain scale-125" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{post.user}</span>
                        <span className="text-[10px] text-zinc-500">{post.location}</span>
                     </div>
                  </div>
                  <MoreHorizontal size={20} className="text-zinc-500" />
               </div>

               {/* Post Image */}
               <div className="aspect-square bg-zinc-900 w-full overflow-hidden">
                  <img src={post.image} className="w-full h-full object-cover" loading="lazy" />
               </div>

               {/* Post Actions */}
               <div className="px-3 py-3">
                  <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-4 text-white">
                        <Heart size={24} className="hover:text-red-500 transition-colors" />
                        <MessageCircle size={24} className="hover:text-amber-500 transition-colors" />
                        <Send size={24} className="hover:text-blue-500 transition-colors" />
                     </div>
                     <Bookmark size={24} className="text-white" />
                  </div>

                  {/* Likes Count */}
                  <div className="text-sm font-bold text-white mb-1">
                    {post.likes} curtidas
                  </div>

                  {/* Caption */}
                  <div className="text-sm leading-relaxed">
                    <span className="font-bold text-white mr-2">{post.user}</span>
                    <span className="text-zinc-300">{post.caption}</span>
                  </div>

                  {/* Time Ago */}
                  <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">
                    {post.time}
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* End of Feed Footer */}
        <div className="py-12 flex flex-col items-center gap-3">
           <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-700">
              <Camera size={24} />
           </div>
           <p className="text-zinc-500 text-sm font-serif">Você chegou ao fim das novidades</p>
        </div>
      </div>
    </div>
  );
};
