import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/Button';

describe('Button Component', () => {
  it('Deve renderizar botão com texto', () => {
    render(
      React.createElement(Button, {
        children: 'Clique aqui',
      })
    );

    expect(screen.getByText('Clique aqui')).toBeInTheDocument();
  });

  it('Deve aplicar variant primary por padrão', () => {
    const { container } = render(
      React.createElement(Button, {
        children: 'Botão',
        variant: 'primary',
      })
    );

    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-blue-600');
  });

  it('Deve aplicar variant danger', () => {
    const { container } = render(
      React.createElement(Button, {
        children: 'Deletar',
        variant: 'danger',
      })
    );

    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-red-600');
  });

  it('Deve desabilitar botão quando loading=true', () => {
    render(
      React.createElement(Button, {
        children: 'Enviar',
        loading: true,
      })
    );

    const button = screen.getByText('Carregando...');
    expect(button).toBeDisabled();
  });

  it('Deve aplicar tamanhos diferentes', () => {
    const { rerender, container } = render(
      React.createElement(Button, {
        children: 'Botão',
        size: 'sm',
      })
    );

    let button = container.querySelector('button');
    expect(button).toHaveClass('px-3');

    rerender(
      React.createElement(Button, {
        children: 'Botão',
        size: 'lg',
      })
    );

    button = container.querySelector('button');
    expect(button).toHaveClass('px-6');
  });
});
