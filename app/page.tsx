import Image from 'next/image'
import Link from 'next/link'
import { HomeButton } from './HomeButton'

export default function Home() {
  return (
    <main>
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
