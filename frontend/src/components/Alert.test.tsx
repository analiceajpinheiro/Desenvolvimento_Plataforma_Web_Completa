import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Alert } from '../components/Alert';

describe('Alert Component', () => {
  it('Deve renderizar alerta de sucesso', () => {
    render(
      React.createElement(Alert, {
        type: 'success',
        message: 'Operação realizada com sucesso!',
      })
    );

    expect(screen.getByText('Operação realizada com sucesso!')).toBeInTheDocument();
  });

  it('Deve renderizar alerta de erro', () => {
    render(
      React.createElement(Alert, {
        type: 'error',
        message: 'Erro ao processar requisição',
      })
    );

    expect(screen.getByText('Erro ao processar requisição')).toBeInTheDocument();
  });

  it('Deve aplicar classes corretas de cor', () => {
    const { container } = render(
      React.createElement(Alert, {
        type: 'warning',
        message: 'Aviso importante',
      })
    );

    const alertDiv = container.querySelector('div');
    expect(alertDiv).toHaveClass('bg-yellow-100');
  });

  it('Deve exibir botão de fechar se callback fornecido', () => {
    const onClose = () => {};
    render(
      React.createElement(Alert, {
        type: 'info',
        message: 'Informação',
        onClose,
      })
    );

    const closeButton = screen.getByText('×');
    expect(closeButton).toBeInTheDocument();
  });
});
