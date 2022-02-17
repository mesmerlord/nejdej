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
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
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
          <Image height="100%" src={image.url} />
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
