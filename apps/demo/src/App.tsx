import {
  Breadcrumb,
  Honeypot,
  ObscrdProvider,
  ProtectedBlock,
  ProtectedEmail,
  ProtectedImage,
  ProtectedPhone,
  ProtectedText,
} from '@obscrd/react'

export function App() {
  return (
    <ObscrdProvider seed="demo-seed-2024">
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
          <ProtectedEmail email="hello@obscrd.dev" />
          <br />
          <ProtectedPhone phone="+1-555-867-5309" />
        </section>

        {/* ── Honeypot ── */}
        <section>
          <h2>AI Honeypot</h2>
          <p>There's a hidden honeypot below — inspect the DOM to see it.</p>
          <Honeypot copyrightNotice="Obscrd Demo" />
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
          <ProtectedImage src="https://picsum.photos/400/300" alt="Demo protected image" />
        </section>
      </main>
    </ObscrdProvider>
  )
}
