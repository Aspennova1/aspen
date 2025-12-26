import { formatCurrency } from "@/lib/formatters"
import { Body, Column, Container, Head, Heading, Html, Preview, Row, Section, Tailwind, Text } from "@react-email/components"

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" })

type EmailType= {
    name: string,
    createdAt: number;
    id: string;
    pricePaidInCents: number;
    email: string;
    company: string;
}

export default function PayReceiptEmail({
  name, createdAt, id, pricePaidInCents, company, email
}: EmailType) {
  const date =
    createdAt < 1e12
      ? new Date(createdAt * 1000)
      : new Date(createdAt);

  return (
    <Html>
      <Preview>Your payment receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-gray-100 py-10 px-6">
          <Container className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* ---------- Header ---------- */}
            <Section className="mb-6">
              <Heading className="text-2xl font-semibold text-center">
                Payment Receipt
              </Heading>
              <Text className="text-center text-gray-500 text-sm">
                Thank you for your payment
              </Text>
            </Section>

            {/* ---------- Billed To ---------- */}
            <Section className="mb-6">
              <Text className="text-sm text-gray-500 mb-2">
                Billed To
              </Text>
              <Text className="font-medium">{name}</Text>
              <Text className="text-sm text-gray-600">{email}</Text>
              <Text className="text-sm text-gray-600">{company}</Text>
            </Section>

            {/* ---------- Divider ---------- */}
            <Section className="border-t border-gray-200 my-6" />

            {/* ---------- Order Info ---------- */}
            <Section className="mb-6">
              <Row>
                <Column>
                  <Text className="text-sm text-gray-500">
                    Order ID
                  </Text>
                  <Text className="font-medium">{id}</Text>
                </Column>

                <Column>
                  <Text className="text-sm text-gray-500">
                    Purchased On
                  </Text>
                  <Text className="font-medium">
                    {dateFormatter.format(date)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* ---------- Amount ---------- */}
            <Section className="bg-gray-50 rounded-lg p-4 mb-6">
              <Row>
                <Column>
                  <Text className="text-sm text-gray-500">
                    Total Paid
                  </Text>
                </Column>
                <Column align="right">
                  <Text className="text-xl font-semibold">
                    {formatCurrency(pricePaidInCents / 100)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* ---------- Footer ---------- */}
            <Section className="text-center">
              <Text className="text-xs text-gray-500">
                If you have any questions, reply to this email.
              </Text>
              <Text className="text-xs text-gray-400 mt-2">
                © {new Date().getFullYear()} Aspen Groups. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}