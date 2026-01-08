import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ReviewFormProps {
  bookingId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface CanReviewResponse {
  canReview: boolean;
  type: string;
}

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="space-y-1">
      <Label className="text-sm text-gray-600">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
            data-testid={`star-${label.toLowerCase().replace(/\s+/g, '-')}-${star}`}
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function ReviewForm({ bookingId, onSuccess, onCancel }: ReviewFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [rating, setRating] = useState(0);
  const [cleanliness, setCleanliness] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [value, setValue] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const { data: canReviewData, isLoading: checkingCanReview } = useQuery<CanReviewResponse>({
    queryKey: ['/api/reviews/can-review', bookingId],
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/reviews', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Recensione inviata",
        description: "Grazie per il tuo feedback!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/reviews/can-review', bookingId] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Impossibile inviare la recensione",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Valutazione richiesta",
        description: "Inserisci almeno la valutazione generale",
        variant: "destructive",
      });
      return;
    }

    createReviewMutation.mutate({
      bookingId,
      type: canReviewData?.type,
      rating,
      cleanliness: cleanliness || null,
      communication: communication || null,
      accuracy: accuracy || null,
      value: value || null,
      title: title || null,
      comment: comment || null,
    });
  };

  if (checkingCanReview) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          Verifica in corso...
        </CardContent>
      </Card>
    );
  }

  if (!canReviewData?.canReview) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          Non puoi scrivere una recensione per questa prenotazione.
        </CardContent>
      </Card>
    );
  }

  const isCustomerReview = canReviewData.type === 'customer_to_owner';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {isCustomerReview ? "Recensisci il proprietario e la barca" : "Recensisci il cliente"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <StarRating
            label="Valutazione Generale"
            value={rating}
            onChange={setRating}
          />
          
          {isCustomerReview && (
            <>
              <StarRating
                label="Pulizia"
                value={cleanliness}
                onChange={setCleanliness}
              />
              <StarRating
                label="Corrispondenza annuncio"
                value={accuracy}
                onChange={setAccuracy}
              />
              <StarRating
                label="Rapporto qualità/prezzo"
                value={value}
                onChange={setValue}
              />
            </>
          )}
          
          <StarRating
            label="Comunicazione"
            value={communication}
            onChange={setCommunication}
          />
          
          <div className="space-y-1">
            <Label htmlFor="title">Titolo (opzionale)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Riassumi la tua esperienza"
              data-testid="input-review-title"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="comment">Commento (opzionale)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Racconta la tua esperienza..."
              rows={4}
              data-testid="input-review-comment"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-review">
                Annulla
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={createReviewMutation.isPending || rating === 0}
              className="flex-1 bg-sky-500 hover:bg-sky-600"
              data-testid="button-submit-review"
            >
              {createReviewMutation.isPending ? "Invio..." : "Invia Recensione"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

interface ReviewCardProps {
  review: {
    id: number;
    rating: number;
    cleanliness?: number | null;
    communication?: number | null;
    accuracy?: number | null;
    value?: number | null;
    title?: string | null;
    comment?: string | null;
    createdAt: string;
    type: string;
  };
  reviewerName?: string;
}

export function ReviewCard({ review, reviewerName }: ReviewCardProps) {
  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="mb-4" data-testid={`review-card-${review.id}`}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            {reviewerName && (
              <p className="font-medium text-gray-900">{reviewerName}</p>
            )}
            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
          <div className="flex items-center gap-1">
            {renderStars(review.rating)}
            <span className="ml-1 font-semibold text-gray-900">{review.rating}/5</span>
          </div>
        </div>
        
        {review.title && (
          <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
        )}
        
        {review.comment && (
          <p className="text-gray-600 mb-3">{review.comment}</p>
        )}
        
        {(review.cleanliness || review.communication || review.accuracy || review.value) && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t text-sm">
            {review.cleanliness && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Pulizia</span>
                {renderStars(review.cleanliness)}
              </div>
            )}
            {review.communication && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Comunicazione</span>
                {renderStars(review.communication)}
              </div>
            )}
            {review.accuracy && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Corrispondenza</span>
                {renderStars(review.accuracy)}
              </div>
            )}
            {review.value && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Valore</span>
                {renderStars(review.value)}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
