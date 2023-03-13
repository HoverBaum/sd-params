import Image from 'next/image'
import Link from 'next/link'
import { HomeButton } from './HomeButton'

export default function Home() {
  return (
    <main>
      <div className="alert alert-info shadow-lg absolute top-4 left-1/2 -translate-x-1/2 max-w-[50%]">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current flex-shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>Under active development!</span>
        </div>
      </div>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-row">
          <Image
            alt="Neon city skyline"
            src="/images/hero.jpeg"
            className="w-1/3 max-w-sm rounded-lg shadow-2xl"
            width={2048}
            height={3072}
          />
          <div>
            <h1 className="text-5xl font-bold">SD Params Explorer</h1>

            <section className="py-8">
              <ul>
                <li className="mb-2">
                  Browser your past creations and see the prompts you&apos;ve
                  used.
                </li>
                <li>Runs on your machines, no images are every uploaded!</li>
              </ul>
            </section>
            <HomeButton />
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <p>
          Created by{' '}
          <Link className="link link-primary" href="https://hoverbaum.net/me">
            Hendrik
          </Link>{' '}
          on{' '}
          <Link
            className="link link-primary"
            href="https://github.com/HoverBaum/sd-params"
          >
            GitHub
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
