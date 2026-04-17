import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  firstName: string;
  email: string;
  temporaryPassword: string;
  portalUrl: string;
}

export default function WelcomeEmail({
  firstName = "there",
  email = "member@example.com",
  temporaryPassword = "temp-pass-123",
  portalUrl = "https://superteam.fun/portal/login",
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Superteam Australia — your account is ready</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>Superteam Australia</Heading>
          </Section>

          <Section style={content}>
            <Heading as="h1" style={h1}>
              Welcome aboard, {firstName}!
            </Heading>
            <Text style={paragraph}>
              You&apos;ve been approved to join the Superteam Australia community.
              Your member profile is now live, and you have access to update your
              profile at any time.
            </Text>

            <Section style={credentialsBox}>
              <Text style={credentialsTitle}>Your login credentials</Text>
              <Text style={credentialRow}>
                <strong>Email:</strong> {email}
              </Text>
              <Text style={credentialRow}>
                <strong>Temporary password:</strong> {temporaryPassword}
              </Text>
            </Section>

            <Text style={paragraph}>
              Please sign in and change your password as soon as possible.
            </Text>

            <Section style={buttonContainer}>
              <Link href={portalUrl} style={button}>
                Sign in to your profile
              </Link>
            </Section>

            <Hr style={divider} />

            <Heading as="h2" style={h2}>
              What you can do
            </Heading>
            <Text style={paragraph}>
              &#x2022; Update your bio, skills, and social links{"\n"}
              &#x2022; Change your password{"\n"}
              &#x2022; Keep your profile information current
            </Text>

            <Hr style={divider} />

            <Text style={footer}>
              If you didn&apos;t expect this email, you can safely ignore it.
            </Text>
            <Text style={footer}>
              &copy; {new Date().getFullYear()} Superteam Australia. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#0a0a0a",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: 0,
};

const container: React.CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
  padding: "20px 0",
};

const header: React.CSSProperties = {
  padding: "24px 32px",
  textAlign: "center" as const,
};

const logo: React.CSSProperties = {
  color: "#1b8a3d",
  fontSize: "20px",
  fontWeight: 900,
  margin: 0,
  letterSpacing: "-0.02em",
};

const content: React.CSSProperties = {
  backgroundColor: "#141414",
  borderRadius: "16px",
  border: "1px solid rgba(27,138,61,0.25)",
  padding: "32px",
};

const h1: React.CSSProperties = {
  color: "#e8e8e8",
  fontSize: "24px",
  fontWeight: 900,
  lineHeight: "1.3",
  margin: "0 0 16px",
};

const h2: React.CSSProperties = {
  color: "#e8e8e8",
  fontSize: "18px",
  fontWeight: 700,
  lineHeight: "1.3",
  margin: "0 0 12px",
};

const paragraph: React.CSSProperties = {
  color: "#a0a0a0",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const credentialsBox: React.CSSProperties = {
  backgroundColor: "#1a1a1a",
  borderRadius: "12px",
  border: "1px solid rgba(27,138,61,0.2)",
  padding: "20px 24px",
  margin: "20px 0",
};

const credentialsTitle: React.CSSProperties = {
  color: "#1b8a3d",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  margin: "0 0 12px",
};

const credentialRow: React.CSSProperties = {
  color: "#e8e8e8",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0 0 6px",
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
};

const buttonContainer: React.CSSProperties = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button: React.CSSProperties = {
  backgroundColor: "#1b8a3d",
  borderRadius: "9999px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: 700,
  padding: "12px 32px",
  textDecoration: "none",
  textAlign: "center" as const,
};

const divider: React.CSSProperties = {
  borderTop: "1px solid rgba(27,138,61,0.2)",
  margin: "24px 0",
};

const footer: React.CSSProperties = {
  color: "#666666",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0 0 4px",
};
