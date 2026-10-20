import coalaImg from '../assets/mascote.svg'; // confirme o nome exato do arquivo SVG em assets
import './Loading.css';

export default function Loading() {
  return (
    <main className="loading-container">
      <img src={coalaImg} alt="Mascote Coala" className="loading-logo" />
      
      <h2>Só um instante...</h2>
      <p>Preparando tudo com carinho para você.</p>
      
      <div className="dots-container">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </main>
  );
}