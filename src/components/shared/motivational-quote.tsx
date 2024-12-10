import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

const quotes = [
  "The secret of getting ahead is getting started. - Mark Twain",
  "It always seems impossible until it's done. - Nelson Mandela",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
];

export default function MotivationalQuote() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <Card className="w-full">
      <CardContent className="p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-center italic text-muted-foreground">
          {quote}
        </p>
      </CardContent>
    </Card>
  );
}
