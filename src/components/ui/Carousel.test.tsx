import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Carousel, CarouselContent, CarouselItem } from './Carousel';

describe('CarouselItem', () => {
  it('считает позиции по количеству детей в рендере', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Один</CarouselItem>
          <CarouselItem>Два</CarouselItem>
          <CarouselItem>Три</CarouselItem>
          <CarouselItem>Четыре</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    expect(screen.getByRole('group', { name: '1 из 4' })).toBeTruthy();
    expect(screen.getByRole('group', { name: '4 из 4' })).toBeTruthy();
  });

  it('пересчитывает подписи после уменьшения количества слайдов', () => {
    const { rerender } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Один</CarouselItem>
          <CarouselItem>Два</CarouselItem>
          <CarouselItem>Три</CarouselItem>
        </CarouselContent>
      </Carousel>
    );
    expect(screen.getByRole('group', { name: '3 из 3' })).toBeTruthy();

    rerender(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Один</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    expect(screen.getByRole('group', { name: '1 из 1' })).toBeTruthy();
  });
});
