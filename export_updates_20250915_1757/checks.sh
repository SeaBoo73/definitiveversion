#!/bin/bash
# SeaBoo - Test endpoint per verifica Apple Store compliance
# Eseguire dopo aver applicato gli aggiornamenti

BASE_URL="http://localhost:5000"
echo "🚤 Testing SeaBoo endpoints..."

echo "1. Apple Auth Health:"
curl -s "$BASE_URL/auth/apple/health" | jq .

echo -e "\n2. Payments Health:"
curl -s "$BASE_URL/payments/health" | jq .

echo -e "\n3. Review Info:"
curl -s "$BASE_URL/review/info" | jq .

echo -e "\n4. IAP Health:"
curl -s "$BASE_URL/iap/health" | jq .

echo -e "\n5. Support URL (Apple richiesto):"
curl -s -w "%{http_code}" "$BASE_URL/supporto" | head -20

echo -e "\n6. Booking Test (Review Mode):"
curl -s -X POST "$BASE_URL/bookings/create" \
  -H "Content-Type: application/json" \
  -d '{"boatId":"demo-boat-1","startDate":"2025-09-20","endDate":"2025-09-21","amount":15000,"currency":"EUR"}' | jq .

echo -e "\n✅ Se tutti gli endpoint restituiscono ok:true, l'app è pronta per Apple Store!"