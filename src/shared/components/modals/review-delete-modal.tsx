import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useModal } from '@/shared/store/use-modal-store';
import Button from '../Button/Button';
import useDeleteReview from '@/shared/models/reviews/useDeleteReview';

interface Props {
  productId: number;
  order: 'recent' | 'ratingDesc' | 'ratingAsc' | 'likeCount';
}

export const ReviewDeleteModal = ({ order = 'recent', productId }: Props) => {
  const { isOpen, onClose, type, data } = useModal();

  const reviewId = data?.reviewId;
  const isModalOpen = isOpen && type === 'reviewDelete';

  const deleteReviewMutation = useDeleteReview({
    reviewId: reviewId,
    productId: productId,
    order,
  });

  const handleDeleteReview = async () => {
    try {
      await deleteReviewMutation.mutateAsync();
      onClose();
    } catch (error) {
      console.error('Delete review failed:', error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="mx-auto w-full max-w-[calc(100%-40px)] bg-[#1c1c22] text-var-white md:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="mb-10 text-2xl">
            정말 삭제하시겠습니까 ?
          </DialogTitle>
          <DialogDescription className="flex flex-col gap-y-5 text-center">
            <Button text="삭제하기" onClick={handleDeleteReview} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};