import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Camera, Route } from "lucide-react";

export default function AITravelSite() {
  const [tripDays, setTripDays] = useState(3);
  const [preferences, setPreferences] = useState("");
  const [itinerary, setItinerary] = useState(null);
  const [photo, setPhoto] = useState(null);

  // Gemini AI route generation
  const generateRoute = async () => {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Create a ${tripDays}-day travel itinerary based on: ${preferences}`
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setItinerary(text || "No itinerary generated");
    } catch (e) {
      setItinerary("Error generating itinerary");
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const placeInParis = () => {
    const bg = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34";
    setPhoto(bg);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Travel Planner</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Map & Route */}
        <Card className="rounded-2xl shadow">
          <CardContent className="p-4 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MapPin /> Smart Map & Route
            </h2>

            {/* OpenStreetMap */}
            <div className="h-64 rounded-xl overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://www.openstreetmap.org/export/embed.html?bbox=33.34350585937501%2C28.023500048883022%2C38.89160156250001%2C31.062345409804408&layer=mapnik"
                style={{ border: "1px solid black" }}
              ></iframe>
            </div>

            <Input
              type="number"
              min="1"
              value={tripDays}
              onChange={(e) => setTripDays(e.target.value)}
              placeholder="Trip days"
            />

            <Textarea
              placeholder="Your interests (food, history, nature...)"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
            />

            <Button onClick={generateRoute} className="w-full">
              <Route className="mr-2" /> Generate AI Route
            </Button>

            {itinerary && (
              <div className="bg-sky-50 p-3 rounded-xl whitespace-pre-line">
                {itinerary}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Photo Travel */}
        <Card className="rounded-2xl shadow">
          <CardContent className="p-4 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Camera /> Travel Photo AI
            </h2>

            <Input type="file" accept="image/*" onChange={handlePhotoUpload} />

            <div className="h-64 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
              {photo ? (
                <img src={photo} alt="user" className="object-cover h-full w-full" />
              ) : (
                "Upload your photo"
              )}
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={placeInParis}>
                Place in Paris
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              AI will place you into famous destinations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
