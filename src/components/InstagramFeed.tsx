import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, Share, Instagram, Loader2 } from "lucide-react";

// Tipos para a API do Instagram
interface InstagramPost {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
  thumbnail_url?: string;
}

// Hook para buscar posts do Instagram
const useInstagramPosts = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        // 🔥 PUXANDO DA API REAL DO INSTAGRAM
        const ACCESS_TOKEN = 'IGAAlqZBv5XjrdBZAFFsanpjd2IxQkhFS2dMTnZAmenZAic0c0MDc2azJwVjZABYU9IMTFjS1huOGhFWDNsZA3NwcVpOdFNzUjdNUWJlbkgwZATVUSnQ4S2JtbTcycnh0SWRFM081YVNvUU5TbUxQaFE5cEhILTdPc1lmUVd1SERITGtvZAwZDZD';
        
        // Tentando conectar com a API do Instagram
        
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,caption,timestamp,like_count,comments_count&access_token=${ACCESS_TOKEN}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          // Erro na API do Instagram
          throw new Error(`❌ TOKEN EXPIRADO - Erro ${response.status}: ${errorData.error?.message || 'Precisa renovar o token'}`);
        }

        const data = await response.json();
        // Dados recebidos da API
        
        if (data.data && data.data.length > 0) {
          const imagePosts = data.data
            .filter((post: InstagramPost) => post.media_type === 'IMAGE')
            .slice(0, 6);
          
          // Posts carregados com sucesso
          setPosts(imagePosts);
        } else {
          throw new Error('Nenhum post encontrado na conta');
        }
      } catch (err) {
        // Erro ao carregar posts do Instagram
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  return { posts, loading, error };
};

// Função para formatar timestamp
const formatTimestamp = (timestamp: string) => {
  const now = new Date();
  const postDate = new Date(timestamp);
  const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'agora';
  if (diffInHours < 24) return `${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks}sem`;
};

export function InstagramFeed() {
  const { posts, loading, error } = useInstagramPosts();
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [showComments, setShowComments] = useState<string | null>(null);

  // Autoplay a cada 5s
  useEffect(() => {
    if (!carouselApi) return;
    const id = setInterval(() => {
      carouselApi.scrollNext();
    }, 5000);
    return () => clearInterval(id);
  }, [carouselApi]);

  // Sincroniza índice atual
  useEffect(() => {
    if (!carouselApi) return;
    const update = (api: CarouselApi) => setCurrent(api.selectedScrollSnap());
    update(carouselApi);
    carouselApi.on("select", update as any);
    carouselApi.on("reInit", update as any);
    return () => {
      carouselApi.off("select", update);
      carouselApi.off("reInit", update);
    };
  }, [carouselApi]);

  const toggleComments = (postId: string) => {
    setShowComments(showComments === postId ? null : postId);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-muted/20 to-muted/40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg text-muted-foreground">Carregando posts do Instagram...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    // Não exibir nada quando há erro - componente fica oculto
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-muted/20 to-muted/40">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Instagram className="h-8 w-8 text-pink-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Siga nosso Instagram
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Acompanhe nossos projetos, conquistas e bastidores no dia a dia da Monitorar
          </p>
        </div>

        {/* Instagram Feed Carousel */}
        <div className="max-w-4xl mx-auto">
          <Carousel opts={{ loop: true }} setApi={setCarouselApi} className="w-full">
            <CarouselContent>
              {posts.map((post) => (
                <CarouselItem key={post.id} className="basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                    {/* Post Image */}
                    <div className="aspect-square overflow-hidden">
                      <a href={post.permalink} target="_blank" rel="noopener noreferrer">
                        <img
                          src={post.media_url}
                          alt="Instagram post"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </a>
                    </div>

                    <CardContent className="p-4">
                      {/* Post Actions */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <a 
                            href={post.permalink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
                          >
                            <Heart className="h-5 w-5" />
                            <span className="text-sm font-medium">{post.like_count || 0}</span>
                          </a>
                          <a 
                            href={post.permalink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors"
                          >
                            <MessageCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">{post.comments_count || 0}</span>
                          </a>
                          <a 
                            href={post.permalink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-600 transition-colors"
                          >
                            <Share className="h-5 w-5" />
                          </a>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatTimestamp(post.timestamp)}</span>
                      </div>

                      {/* Post Caption */}
                      <p className="text-sm text-foreground leading-relaxed mb-3 line-clamp-3">
                        {post.caption || 'Veja no Instagram'}
                      </p>

                      {/* Link para ver no Instagram */}
                      <a
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-pink-500 hover:text-pink-600 transition-colors font-medium"
                      >
                        Ver no Instagram →
                      </a>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white/90 hover:bg-white text-foreground border-2" />
            <CarouselNext className="bg-white/90 hover:bg-white text-foreground border-2" />
          </Carousel>

          {/* Indicadores */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {posts.map((_, i) => (
              <button
                key={i}
                aria-label={`Ir para post ${i + 1}`}
                onClick={() => carouselApi?.scrollTo(i)}
                className={`${
                  i === current ? "bg-pink-500" : "bg-gray-300"
                } h-2 w-2 rounded-full transition-colors hover:scale-110`}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <a
              href="https://instagram.com/monitorarconsultoria_"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Instagram className="h-5 w-5" />
              Seguir @monitorarconsultoria_
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
