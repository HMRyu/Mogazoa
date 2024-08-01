import { cn } from '@/lib/utils';
import useAnimation from '@/shared/hooks/useAnimation';
import { Product } from '@/shared/types/product/product';
import fixedNumber from '@/shared/utils/fixedNumber';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CarouselProps {
  products: Product[];
  className: string;
}

const Carousel = ({ products, className }: CarouselProps) => {
  const [currentProduct, setCurrentProduct] = useState<Product>(products[0]);
  const [showDescription, setShowDescription] = useState(false);
  const [renderDescription, showDescriptionAnimate, handleAnimateDescription] =
    useAnimation(showDescription);
  let timerId: NodeJS.Timeout;

  useEffect(() => {
    const currentProductIdx = products.findIndex(
      (product) => product.id === currentProduct.id,
    );

    timerId = setInterval(() => {
      if (products[currentProductIdx + 1]) {
        setCurrentProduct(products[currentProductIdx + 1]);
      } else {
        setCurrentProduct(products[0]);
      }
    }, 3000);

    return () => {
      clearInterval(timerId);
    };
  }, [currentProduct]);

  if (products.length === 0) return null;

  return (
    <div
      className={cn(
        'relative flex h-[300px] w-full flex-col overflow-hidden rounded-[8px]',
        className,
      )}
      onMouseEnter={() => setShowDescription(true)}
      onMouseLeave={() => setShowDescription(false)}
    >
      <div className={cn('relative size-full')}>
        <Carousel.Image currentProduct={currentProduct} />
        {renderDescription && (
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-t from-black/70 to-transparent',
              showDescriptionAnimate ? 'animate-fadeIn' : 'animate-fadeOut',
            )}
          />
        )}
        <div className="absolute bottom-0 flex w-full flex-col overflow-hidden shadow-2xl">
          {renderDescription && (
            <>
              <Carousel.CardDescription
                currentProduct={currentProduct}
                showDescriptionAnimate={showDescriptionAnimate}
                handleAnimateDescription={handleAnimateDescription}
              />
              <div className="flex h-[40px]">
                <Carousel.List
                  showDescriptionAnimate={showDescriptionAnimate}
                  onMouseEnter={(product) => setCurrentProduct(product)}
                  currentProduct={currentProduct}
                  products={products}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

Carousel.Image = ({ currentProduct }: { currentProduct: Product }) => {
  return (
    <Image
      src={currentProduct?.image}
      alt={String(currentProduct?.id)}
      fill
      className={cn('object-cover')}
    />
  );
};

Carousel.CardDescription = ({
  currentProduct,
  showDescriptionAnimate,
  handleAnimateDescription,
}: {
  currentProduct: Product;
  showDescriptionAnimate: boolean;
  handleAnimateDescription: () => void;
}) => {
  return (
    <Link href={`/detail/${currentProduct?.id}`}>
      <div
        className={cn(
          'flex animate-fadeIn cursor-pointer flex-col gap-[4px] p-[12px] font-semibold text-var-white',
          showDescriptionAnimate ? 'animate-fadeIn' : 'animate-fadeOut',
        )}
        onAnimationEnd={handleAnimateDescription}
      >
        <p className="text-[24px]">{currentProduct?.name}</p>
        <div className="flex gap-[12px] font-light text-var-gray2">
          <div className="flex gap-[8px]">
            <Image src="/images/star.svg" alt="별점" width={12} height={12} />
            {currentProduct && <p>{fixedNumber(currentProduct.rating)}</p>}
          </div>
          <div className="flex gap-[8px]">
            <Image src="/images/heart.svg" alt="별점" width={12} height={12} />
            <p>{currentProduct?.favoriteCount}</p>
          </div>
          <div className="flex gap-[8px]">
            <Image
              src="/images/speechBubble.svg"
              alt="별점"
              width={12}
              height={12}
            />
            <p>{currentProduct?.reviewCount}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

Carousel.List = ({
  showDescriptionAnimate,
  onMouseEnter,
  currentProduct,
  products,
}: {
  showDescriptionAnimate: boolean;
  onMouseEnter: (product: Product) => void;
  currentProduct: Product;
  products: Product[];
}) => {
  return products.map((product) => (
    <Link
      key={product.id}
      href={`/detail/${product?.id}`}
      className={cn(
        'flex w-full items-center justify-center border-r border-var-black2 bg-var-black3 text-[12px] text-var-gray1 transition-colors duration-300 active:bg-var-black1 md:text-[16px]',
        currentProduct?.name === product?.name && 'bg-var-black2',
        showDescriptionAnimate ? 'animate-fadeIn' : 'animate-fadeOut',
      )}
      onMouseEnter={() => onMouseEnter(product)}
    >
      {product.name}
    </Link>
  ));
};

export default Carousel;
