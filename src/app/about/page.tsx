import Link from "next/link";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/lib/site-config";

const values = [
  {
    title: "Built for local action",
    description:
      "From rentals and jobs to services and resale listings, every surface is designed for quick discovery and faster responses.",
  },
  {
    title: "Trust-first experience",
    description:
      "Clear categories, contact details, and listing context help people make better decisions without unnecessary friction.",
  },
  {
    title: "Simple to use",
    description:
      "Posting, browsing, and connecting are kept straightforward so local buyers and sellers can focus on real outcomes.",
  },
];

export default function AboutPage() {
  return (
    <PageShell
      title={`About ${SITE_CONFIG.name}`}
      description={`${SITE_CONFIG.name} is a local classifieds and business discovery platform focused on clarity, trust, and fast action.`}
      actions={
        <>
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border bg-card">
          <CardContent className="space-y-4 p-6">
            <Badge variant="secondary">Our Story</Badge>
            <h2 className="text-2xl font-semibold text-foreground">
              A practical marketplace for everyday local needs.
            </h2>
            <p className="text-sm text-muted-foreground">
              {SITE_CONFIG.name} helps local communities buy, sell, hire, and promote with a cleaner experience that
              makes listings easier to scan and easier to act on.
            </p>
            <p className="text-sm text-muted-foreground">
              The goal is simple: reduce clutter, surface the details that matter, and make each listing interaction
              feel trustworthy on both mobile and desktop.
            </p>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {values.map((value) => (
            <Card key={value.title} className="border-border bg-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
