import {
  Breadcrumb,
  ObscrdProvider,
  ProtectedBlock,
  ProtectedEmail,
  ProtectedImage,
  ProtectedLink,
  ProtectedPhone,
  ProtectedText,
} from '@obscrd/react'

export function App() {
  return (
    <ObscrdProvider seed="demo-seed-2024" honeypot copyrightNotice="Obscrd Demo">
      <main>
        <h1>Obscrd Demo</h1>
        <p>View source or inspect the DOM to see obfuscation in action.</p>

        {/* ── Text Obfuscation ── */}
        <section>
          <h2>Text Obfuscation</h2>
          <span className="label">Light</span>
          <ProtectedText level="light">This text is lightly obfuscated.</ProtectedText>
          <span className="label">Medium</span>
          <ProtectedText level="medium">This text has medium protection with character shuffling.</ProtectedText>
          <span className="label">Maximum</span>
          <ProtectedText level="maximum">Maximum protection — DOM is fully scrambled.</ProtectedText>
        </section>

        {/* ── Contact Protection ── */}
        <section>
          <h2>Contact Protection</h2>
          <ProtectedEmail
            email="hello@obscrd.dev"
            subject="Hello from the demo"
            body="I found your site through the Obscrd demo."
          />
          <br />
          <ProtectedPhone phone="+1-555-867-5309" />
        </section>

        {/* ── Protected Links ── */}
        <section>
          <h2>Protected Links</h2>
          <ProtectedLink href="https://wa.me/15551234567">Chat on WhatsApp</ProtectedLink>
          <br />
          <ProtectedLink href="https://obscrd.dev">
            <ProtectedText>Visit our site</ProtectedText>
          </ProtectedLink>
        </section>

        {/* ── Clipboard Protection ── */}
        <section>
          <h2>Clipboard Protection</h2>
          <ProtectedBlock>
            <ProtectedText>Try selecting and copying this text — the clipboard gets scrambled.</ProtectedText>
          </ProtectedBlock>
        </section>

        {/* ── Forensic Breadcrumb ── */}
        <section>
          <h2>Forensic Breadcrumb</h2>
          <p>An invisible tracking ID is embedded below.</p>
          <Breadcrumb id="demo-breadcrumb-001" />
        </section>

        {/* ── Image Protection ── */}
        <section>
          <h2>Image Protection</h2>
          <ProtectedImage
            style={{ marginBottom: '8px' }}
            src="https://picsum.photos/400/300"
            alt="Demo protected image"
            crossOrigin="anonymous"
            objectFit="cover"
            width={400}
            height={300}
          />
          <ProtectedImage
            src="https://broken.invalid/nope.jpg"
            alt="This image intentionally fails"
            width={400}
            height={150}
          />
        </section>
      </main>
    </ObscrdProvider>
  )
}
