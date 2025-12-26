import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Button,
  Tailwind,
} from "@react-email/components";

type ResetPasswordEmailProps = {
  name?: string;
  resetUrl: string;
  expiresInMinutes?: number;
};

export default function ResetPasswordEmail({
  name,
  resetUrl,
  expiresInMinutes = 15,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Preview>Reset your password</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl border border-gray-200 rounded-lg p-6">
            <Heading className="text-2xl mb-4">
              Reset your password
            </Heading>

            <Section className="mb-4">
              <Text className="text-base">
                Hi {name ?? "there"},
              </Text>

              <Text className="text-base text-gray-700">
                We received a request to reset your password. Click the button
                below to set a new one.
              </Text>
            </Section>

            <Section className="text-center my-6">
              <Button
                href={resetUrl}
                className="bg-black text-white px-6 py-3 rounded-md text-sm font-medium"
              >
                Reset Password
              </Button>
            </Section>

            <Section>
              <Text className="text-sm text-gray-600">
                This link will expire in {expiresInMinutes} minutes.
              </Text>

              <Text className="text-sm text-gray-600">
                If you did not request a password reset, you can safely ignore
                this email.
              </Text>
            </Section>

            <Section className="mt-6 border-t border-gray-200 pt-4">
              <Text className="text-xs text-gray-500">
                For security reasons, this link can only be used once.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
