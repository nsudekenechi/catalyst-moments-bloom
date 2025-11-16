import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Img,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface VerificationEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
  user_email: string
}

export const VerificationEmail = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
  user_email,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Catalyst Mom! Verify your email to get started.</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with brand colors */}
        <Section style={header}>
          <Heading style={brandName}>Catalyst Mom</Heading>
          <Text style={tagline}>Empowering Mothers, Every Step of the Way</Text>
        </Section>

        {/* Main content */}
        <Section style={content}>
          <Heading style={h1}>Welcome to Your Journey! 🌟</Heading>
          
          <Text style={text}>
            Hi there,
          </Text>
          
          <Text style={text}>
            We're thrilled to have you join the Catalyst Mom community! You're just one step away from accessing:
          </Text>

          <Section style={benefitsList}>
            <Text style={benefitItem}>✨ Personalized fitness & wellness plans</Text>
            <Text style={benefitItem}>🥗 Nutrition guidance tailored to your journey</Text>
            <Text style={benefitItem}>👶 Expert support for every motherhood stage</Text>
            <Text style={benefitItem}>💪 Supportive community of amazing moms</Text>
          </Section>

          <Text style={text}>
            Click the button below to verify your email address and unlock your full experience:
          </Text>

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Link
              href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
              style={button}
            >
              Verify My Email
            </Link>
          </Section>

          <Text style={alternativeText}>
            Or copy and paste this verification code:
          </Text>
          
          <Section style={codeContainer}>
            <code style={code}>{token}</code>
          </Section>

          <Text style={footerText}>
            This link will expire in 24 hours. If you didn't create an account with Catalyst Mom, you can safely ignore this email.
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerBrand}>
            Catalyst Mom
          </Text>
          <Text style={footerLinks}>
            <Link href="https://catalystmomofficial.com" style={link}>
              Visit our website
            </Link>
            {' · '}
            <Link href="https://catalystmomofficial.com/faq" style={link}>
              FAQ
            </Link>
            {' · '}
            <Link href="https://catalystmomofficial.com/community" style={link}>
              Community
            </Link>
          </Text>
          <Text style={copyright}>
            © {new Date().getFullYear()} Catalyst Mom. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default VerificationEmail

// Styles with Catalyst Mom brand colors
const main = {
  backgroundColor: '#FFF8F0', // cream background
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#C17F45', // copper
  borderRadius: '16px 16px 0 0',
  padding: '32px 24px',
  textAlign: 'center' as const,
}

const brandName = {
  color: '#FFFFFF',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0 0 8px 0',
  letterSpacing: '-0.5px',
}

const tagline = {
  color: '#FDE1D3', // peach
  fontSize: '14px',
  margin: '0',
  fontWeight: '400',
}

const content = {
  backgroundColor: '#FFFFFF',
  padding: '40px 32px',
}

const h1 = {
  color: '#5D2906', // brown
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 24px 0',
  lineHeight: '1.3',
}

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
}

const benefitsList = {
  margin: '24px 0',
  padding: '20px',
  backgroundColor: '#FDE1D3', // peach
  borderRadius: '12px',
  borderLeft: '4px solid #C17F45', // copper
}

const benefitItem = {
  color: '#5D2906', // brown
  fontSize: '15px',
  lineHeight: '1.8',
  margin: '8px 0',
  fontWeight: '500',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#C17F45', // copper
  borderRadius: '12px',
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 48px',
  boxShadow: '0 4px 12px rgba(193, 127, 69, 0.3)',
}

const alternativeText = {
  color: '#666666',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '24px 0 12px 0',
}

const codeContainer = {
  textAlign: 'center' as const,
  margin: '16px 0 32px 0',
}

const code = {
  display: 'inline-block',
  padding: '16px 32px',
  backgroundColor: '#F9F0E6', // beige
  borderRadius: '8px',
  border: '2px solid #E5D3B3', // tan
  color: '#5D2906', // brown
  fontSize: '18px',
  fontWeight: '700',
  letterSpacing: '2px',
  fontFamily: 'monospace',
}

const footerText = {
  color: '#666666',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '24px 0 0 0',
  textAlign: 'center' as const,
}

const footer = {
  backgroundColor: '#F9F0E6', // beige
  borderRadius: '0 0 16px 16px',
  padding: '32px 24px',
  textAlign: 'center' as const,
}

const footerBrand = {
  color: '#5D2906', // brown
  fontSize: '16px',
  fontWeight: '700',
  margin: '0 0 12px 0',
}

const footerLinks = {
  color: '#666666',
  fontSize: '13px',
  margin: '0 0 16px 0',
}

const link = {
  color: '#C17F45', // copper
  textDecoration: 'none',
  fontWeight: '500',
}

const copyright = {
  color: '#999999',
  fontSize: '12px',
  margin: '0',
}
