import React from 'react';
import koalaIcon from '../../assets/koala-icon.png';

export default function BrandLink({
  href = './',
  label = 'Voltar para o início do Oullin',
}) {
  return (
    <a className="brand" href={href} aria-label={label}>
      <img src={koalaIcon} alt="Oullin" />
    </a>
  );
}
