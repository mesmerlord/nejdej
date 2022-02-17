import { Container, Group, Image } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ImageBox = ({ images }) => {
  const [mainImage, setMainImage] = useState(0);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    centerMode: false,
  };
  const slider = useRef<any>();
  useEffect(() => {
    if (slider) {
      slider?.current?.slickGoTo(mainImage);
    }
  }, [mainImage]);
  return (
    <Container>
      <Slider ref={slider} {...settings}>
        {images.map((image, index) => (
          <Image
            width={400}
            src={`${image.url}?tr=h-600,w-800,ote-TkVKREVKLkNPTQ==,cm-force,bg-F3F3F3,ox-N35,oy-N50,ots-50,oa-6,otbg-70FFFF30`}
          />
        ))}
      </Slider>
      <Group>
        {images.map((image, index) => (
          <Image
            onClick={() => {
              if (index != mainImage) {
                setMainImage(index);
              }
            }}
            width={100}
            src={image.url}
          />
        ))}
      </Group>
    </Container>
  );
};

export default ImageBox;
