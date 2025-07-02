"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Phone, MessageCircle, ExternalLink, Share2, X, AlertTriangle, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type ContactType = {
  emoji: string
  name: string
  phone: string
  hasWhatsApp?: boolean
  isExternal?: boolean
  externalUrl?: string
  isUrgent?: boolean
}

const CABA_CONTACTS: ContactType[] = [
  { emoji: "🚑", name: "SAME", phone: "107", isUrgent: true },
  { emoji: "👮‍♂️", name: "Policía", phone: "911", isUrgent: true },
  { emoji: "🔥", name: "Bomberos", phone: "100", isUrgent: true },
  { emoji: "🛡️", name: "Defensa Civil", phone: "103" },
  { emoji: "🏚️", name: "Calle", phone: "108" },
  { emoji: "🚺", name: "Violencia de Género", phone: "144", hasWhatsApp: true },
  { emoji: "🧠💔", name: "Suicidio", phone: "135" },
  { emoji: "📞", name: "Reclamos GCBA", phone: "147" },
  { emoji: "💡", name: "Edenor", phone: "0800-666-4001" },
  { emoji: "⚡", name: "Edesur", phone: "0800-222-0200" },
  { emoji: "💧", name: "Aysa", phone: "0800-321-2482" },
  { emoji: "💊🌐", name: "Farmacias", phone: "", isExternal: true, externalUrl: "https://farmacias.com.ar" },
]

const PBA_CONTACTS: ContactType[] = [
  { emoji: "🚨", name: "Emergencias", phone: "911", isUrgent: true },
  { emoji: "🚑", name: "SAME", phone: "107", isUrgent: true },
  { emoji: "👮‍♂️", name: "Policía", phone: "911", isUrgent: true },
  { emoji: "🔥", name: "Bomberos", phone: "100", isUrgent: true },
  { emoji: "🛡️", name: "Defensa Civil", phone: "103" },
  { emoji: "🏚️", name: "Calle", phone: "108" },
  { emoji: "🚺", name: "Violencia de Género", phone: "144", hasWhatsApp: true },
  { emoji: "🧠💔", name: "Suicidio", phone: "135" },
  { emoji: "📞", name: "Reclamos Municipales", phone: "0800-222-0021" },
  { emoji: "💡", name: "Eden", phone: "0800-999-3336" },
  { emoji: "⚡", name: "Edelap", phone: "0800-222-3335" },
  { emoji: "💧", name: "ABSA", phone: "0800-999-2272" },
  { emoji: "💊🌐", name: "Farmacias", phone: "", isExternal: true, externalUrl: "https://farmacias.com.ar" },
]

export default function AyudameYa() {
  const [selectedZone, setSelectedZone] = useState<"CABA" | "PBA">("CABA")
  const [showWelcomePopup, setShowWelcomePopup] = useState(false)
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false)
  const [showRatingPopup, setShowRatingPopup] = useState(false)
  const [sponsorForm, setSponsorForm] = useState({ name: "", email: "", message: "" })
  const [showSponsorForm, setShowSponsorForm] = useState(false) // Declared the missing variable

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("ayudame-ya-welcome")
    if (!hasSeenWelcome) {
      setShowWelcomePopup(true)
    }

    // Show rating popup after 10 seconds
    const timer = setTimeout(() => {
      setShowRatingPopup(true)
    }, 10000)

    // Auto-hide rating popup after 15 seconds if not interacted
    const autoHideTimer = setTimeout(() => {
      setShowRatingPopup(false)
    }, 25000)

    return () => {
      clearTimeout(timer)
      clearTimeout(autoHideTimer)
    }
  }, [])

  const handleWelcomeClose = () => {
    setShowWelcomePopup(false)
    localStorage.setItem("ayudame-ya-welcome", "true")
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const handleWhatsApp = (phone: string) => {
    window.open(`https://wa.me/54${phone.replace(/\D/g, "")}`, "_blank")
  }

  const handleExternalLink = (url: string) => {
    window.open(url, "_blank")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Ayúdame Ya - Teléfonos de emergencia",
          text: "App gratuita con teléfonos de emergencia para Buenos Aires",
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("¡Link copiado al portapapeles!")
    }
  }

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      "🚨 Ayúdame Ya - App gratuita con teléfonos de emergencia para Buenos Aires: " + window.location.href,
    )
    window.open(`https://wa.me/?text=${text}`, "_blank")
  }

  const handleSponsorClick = () => {
    const subject = encodeURIComponent("Quiero patrocinar Ayúdame Ya")
    const body = encodeURIComponent(
      "Hola, me interesa patrocinar la app Ayúdame Ya. Por favor contactenme para más información.",
    )
    window.location.href = `mailto:diego.rotryng.trad@gmail.com?subject=${subject}&body=${body}`
  }

  const handleSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("¡Gracias por tu interés! Te contactaremos pronto.")
    setShowSponsorForm(false)
    setSponsorForm({ name: "", email: "", message: "" })
  }

  const contacts = selectedZone === "CABA" ? CABA_CONTACTS : PBA_CONTACTS
  const urgentContacts = contacts.filter((contact) => contact.isUrgent).slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 relative">
      {/* Header */}
      <header className="bg-red-800 text-white p-6 shadow-xl">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-black text-center mb-3 flex items-center justify-center gap-3">
            <span className="animate-pulse">🚨</span>
            Ayúdame Ya
          </h1>
          <p className="text-center text-red-100 text-sm md:text-lg font-medium drop-shadow-sm mb-2">
            Teléfonos de emergencia rápidos y claros
          </p>
          <p className="text-center text-red-200 text-sm md:text-base font-medium">
            🧡 Esta app puede salvar vidas. Compartila.
          </p>
        </div>
      </header>

      {/* Zone Selector */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <Label htmlFor="zone-select" className="text-xl font-bold mb-4 block text-gray-800">
            Seleccionar zona:
          </Label>
          <Select value={selectedZone} onValueChange={(value: "CABA" | "PBA") => setSelectedZone(value)}>
            <SelectTrigger className="w-full max-w-md text-lg font-semibold py-3 px-4 border-2 border-gray-300 rounded-lg shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CABA" className="text-lg font-medium py-3">
                CABA (Ciudad de Buenos Aires)
              </SelectItem>
              <SelectItem value="PBA" className="text-lg font-medium py-3">
                Provincia de Buenos Aires
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Contacts Grid - Now 4 columns on large screens */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {contacts.map((contact, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-0 shadow-md hover:scale-105"
            >
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{contact.emoji}</div>
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{contact.name}</h3>
                  {contact.phone && <p className="text-gray-600 text-sm font-medium">{contact.phone}</p>}
                </div>

                <div className="flex flex-col gap-3">
                  {contact.isExternal ? (
                    <Button
                      onClick={() => handleExternalLink(contact.externalUrl!)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Ver sitio
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleCall(contact.phone)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                    >
                      <Phone className="w-5 h-5" />
                      Llamar
                    </Button>
                  )}

                  {contact.hasWhatsApp && (
                    <Button
                      onClick={() => handleWhatsApp(contact.phone)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Emergency Floating Button */}
      <button
        onClick={() => setShowEmergencyPopup(true)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 animate-pulse z-50 flex items-center gap-2"
      >
        <AlertTriangle className="w-6 h-6" />
        <span className="hidden sm:inline">EMERGENCIA</span>
        <span className="sm:hidden">🚨</span>
      </button>

      {/* Footer */}
      <footer className="bg-gray-100 p-8 mt-12 border-t-2 border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-700 mb-3 font-medium">
            Creado por einstech –{" "}
            <a
              href="https://www.einstech.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-semibold"
            >
              www.einstech.com.ar
            </a>
          </p>
          <p className="text-gray-600 mb-6 text-lg">
            💡 ¡Tu empresa puede ayudar! Contacta para patrocinar esta app solidaria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:diego.rotryng.trad@gmail.com?subject=Quiero%20patrocinar%20Ayúdame%20Ya"
              className="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 bg-transparent"
            >
              Patrocinar esta app
            </a>
            <Button
              onClick={handleShare}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 active:scale-95 flex items-center gap-3 shadow-lg hover:shadow-xl"
            >
              <Share2 className="w-5 h-5" />📤 Compartir esta app
            </Button>
          </div>
        </div>
      </footer>

      {/* Emergency Full-Screen Popup */}
      <Dialog open={showEmergencyPopup} onOpenChange={setShowEmergencyPopup}>
        <DialogContent className="max-w-4xl w-full h-full max-h-screen bg-red-50 border-4 border-red-600">
          <DialogHeader className="text-center pb-6">
            <DialogTitle className="text-4xl font-black text-red-800 mb-4">🚨 EMERGENCIA INMEDIATA 🚨</DialogTitle>
            <p className="text-xl text-red-700 font-bold">Contactos más urgentes - Llamá YA</p>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
            {urgentContacts.map((contact, index) => (
              <Card key={index} className="bg-white border-4 border-red-400 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">{contact.emoji}</div>
                  <h3 className="text-2xl font-black text-gray-800 mb-2">{contact.name}</h3>
                  <p className="text-xl text-gray-600 font-bold mb-6">{contact.phone}</p>
                  <Button
                    onClick={() => handleCall(contact.phone)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-6 px-8 rounded-xl text-2xl transition-all duration-200 active:scale-95 shadow-xl hover:shadow-2xl"
                  >
                    <Phone className="w-8 h-8 mr-4" />
                    LLAMAR AHORA
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Welcome Popup */}
      <Dialog open={showWelcomePopup} onOpenChange={setShowWelcomePopup}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">¡Bienvenido a Ayúdame Ya!</DialogTitle>
          </DialogHeader>
          <div className="text-center p-4">
            <p className="mb-4">⬆️ Recordá guardar esta app como acceso directo en tu pantalla.</p>
            <Button onClick={handleWelcomeClose} className="w-full">
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Improved Rating Popup - Mini floating */}
      {showRatingPopup && (
        <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white p-4 rounded-xl shadow-2xl border-2 border-yellow-400 z-40 animate-in slide-in-from-bottom-5">
          <button
            onClick={() => setShowRatingPopup(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-2">⭐</span>
            <span className="font-bold text-gray-800">¿Te fue útil? Valoranos y compartí</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleWhatsAppShare} size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
              <MessageCircle className="w-4 h-4 mr-1" />
              WhatsApp
            </Button>
            <Button onClick={handleShare} size="sm" className="flex-1">
              🔗 Compartir
            </Button>
            <Button
              onClick={() => {
                // Generate QR code URL
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}`
                window.open(qrUrl, "_blank")
              }}
              size="sm"
              variant="outline"
              className="hidden md:flex"
            >
              <QrCode className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
