import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ stripe_session_id: string | undefined }>;
}) {
  const { stripe_session_id } = await searchParams;

  console.log("[stripe/success] Checkout session id:", stripe_session_id);

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-center">
            Pagamento realizado com sucesso!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            Obrigado por assinar nosso serviço. Seu plano está ativo e você já
            pode começar a usar todos os recursos.
          </p>
          <Button asChild>
            <Link href="/dashboard">Ir para o Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
