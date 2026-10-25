import coala from "../assets/Coala_deitado.png";
import Button from "../components/Button";
import Image from "../components/Image";
import googleIcon from "../assets/Google.png";
import facebookIcon from "../assets/Facebook.png";
import appleIcon from "../assets/Apple.png";
import nome_oullin from "../assets/nome_oullin.png";

export default function SignUp() {
  return (
    <main className="flex min-h-screen w-full max-w-full min-w-0 flex-col overflow-x-hidden bg-[#F0F0F0] text-white">
      <section className="flex w-full min-w-0 items-start justify-between gap-2 overflow-hidden rounded-b-[20px] bg-[#fff] px-3" aria-label="Ilustra��o do Oullin">
        <div className="flex h-[clamp(180px,70vw,300px)] min-w-0 flex-1 max-w-[260px] flex-col items-center justify-center rounded-b-[20px] bg-[#0D4889] px-3 text-center shadow-md">
          <h1 className="m-0 w-full text-left text-[clamp(18px,5vw,32px)] leading-tight text-white font-moderustic [word-spacing:0.12em] max-w-[5ch]"> Bem vindo <span className="text-[#FFB703] text-[30px]">ao</span></h1>
          <Image src={nome_oullin} alt="Nome Oullin" className="h-auto w-[clamp(100px,20vw,190px)] object-contain shadow-none -translate-y-14 translate-x-7" />
        </div>
        <Image
          src={coala}
          alt="Coala"
          className="h-auto w-[clamp(90px,37vw,180px)] max-w-[38vw] shrink-0 object-contain shadow-none translate-y-6" />
      </section>

      <section className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="box-border h-auto min-h-[80vw] w-full max-w-md overflow-hidden rounded-[20px] bg-[#FFB703] px-6 py-4 sm:px-8 sm:py-6">
          <div className="flex w-full min-w-0 flex-col gap-6">

            <input
              type="email"
              style={{ marginTop: "20px", paddingLeft: "10px" }}
              id="email"
              placeholder="Email"
              className="self-center box-border w-[min(90vw)] max-w-full min-w-0 h-[min(30px,8vh)] rounded-[10px] bg-white pr-3 text-black shadow-md font-moderustic"
            />

            <input
              type="password"
              style={{ paddingLeft: "10px" }}
              id="senha"
              placeholder="Senha"
              className="self-center box-border w-[min(90vw)] max-w-full min-w-0 h-[min(30px,8vh)] rounded-[10px] bg-white px-3 text-black shadow-md font-moderustic"/>

            <label style={{marginLeft:"20px"}} className=" text-left text-black font-moderustic m"><a src="#">Esqueceu sua senha?</a></label>
            <Button className="box-border self-center w-[min(80vw,320px)] h-[min(40px,8vh)] rounded-[20px] max-w-full font-moderustic">Entrar</Button>
            <div className="mt-2 flex w-full min-w-0 flex-col gap-4">
              <div className="flex w-full min-w-0 items-center gap-2" aria-hidden="true">
                <span className="h-px flex-1 bg-black/30" />
                <span className="text-center text-sm text-black font-moderustic">Entre também com:</span>
                <span className="h-px flex-1 bg-black/30" />
              </div>
              <div className="flex w-full min-w-0 flex-wrap justify-center gap-3">
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
