import coala from "../assets/Coala_deitado.png";
import Button from "../components/Button";
import Image from "../components/Image";
import googleIcon from "../assets/Google.png";
import facebookIcon from "../assets/Facebook.png";
import appleIcon from "../assets/Apple.png";
import nome_oullin from "../assets/nome_oullin.png";

export default function SignUp() {
  return (
    <main className="relative left-1/2 flex min-h-screen w-screen max-w-none -translate-x-1/2 flex-col bg-[#F0F0F0] text-white">
      <section className="grid gap-[65vw] w-full grid-cols-3 items-start bg-[#fff]  rounded-b-[20px]" aria-label="Ilustra��o do Oullin">
        <div className="col-span-1 flex h-[clamp(180px,70vw,300px)] w-[min(70vw,260px)] flex-col items-center justify-center rounded-b-[20px] bg-[#0D4889] px-3 text-center shadow-md">
          <h1 className="m-0 w-full text-left text-[clamp(18px,5vw,32px)] leading-tight text-white font-moderustic [word-spacing:0.12em] max-w-[5ch]"> Bem vindo <span className="text-[#FFB703] text-[30px]">ao</span></h1>
          <Image src={nome_oullin} alt="Nome Oullin" className="flex ml-15  h-auto w-[clamp(100px,20vw,190px)] object-contain shadow-none -translate-y-14" />
        </div>
        <Image
          src={coala}
          alt="Coala"
          className="col-span-2 h-auto w-[clamp(90px,35vw,180px)] max-w-full object-contain shadow-none -translate-x-2 translate-y-5 " />
      </section>

      <section className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md min-h-[80vw] rounded-[20px] bg-[#FFB703] p-6 shadow-md">
          <div className="flex flex-col gap-10">

            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full rounded-md px-3 py-2 text-black shadow-md bg-white font-moderustic"
            />

            <input
              type="password"
              id="senha"
              placeholder="Senha"
              className="w-full rounded-md px-3 py-2 text-black shadow-md bg-white font-moderustic"
            />
            <label className="text-left text-black font-moderustic"><a src="#">Esqueceu sua senha?</a></label>
            <Button className="font-moderustic">Entrar</Button>
            <div className="mt-2 flex flex-col gap-4">
              <div className="flex items-center gap-3" aria-hidden="true">
                <span className="h-px flex-1 bg-black/30" />
                <span className="whitespace-nowrap text-black font-moderustic">Entre também com:</span>
                <span className="h-px flex-1 bg-black/30" />
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <button aria-label="Continuar com Google" className="flex h-9 w-9 border-none items-center justify-center rounded-full border border-[#E8E4DA] bg-white p-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D4889]">
                  <Image src={googleIcon} alt="" className="h-10 w-5 object-contain shadow-none" />
                </button>
                <button aria-label="Continuar com Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E4DA] bg-white p-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D4889]">
                  <Image src={facebookIcon} alt="" className="h-10 w-10 object-contain shadow-none" />
                </button>
                <button aria-label="Continuar com Apple" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E4DA] bg-white p-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D4889]">
                  <Image src={appleIcon} alt="" className="h-5 w-5 object-contain shadow-none" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
