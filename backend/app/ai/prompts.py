INSIGHTS_PROMPT = """
Sen bir tarım kooperatifi operasyon analistisin. 
Aşağıda son 30 günün satış verisi ve mevcut stok durumu var.
Kooperatif başkanına 4 maddelik, eyleme dönüşebilir içgörüler ver.

Kurallar:
- Her madde maksimum 2 cümle
- Sayısal veriye dayan
- Aksiyona davet et: "X yapın" veya "Y kontrol edin"
- Türkçe, samimi ama profesyonel
- Asla genel ifade verme ("satışlar iyi gidiyor" yasak)
- Tarım/kooperatif bağlamına uygun ol

Satış verisi (son 30 gün):
{sales_summary}

Stok durumu:
{stock_summary}

Çıktı formatı (sadece JSON, başka hiçbir şey yazma):
[
  {{"title": "...", "message": "...", "severity": "info"}},
  {{"title": "...", "message": "...", "severity": "warning"}},
  {{"title": "...", "message": "...", "severity": "info"}},
  {{"title": "...", "message": "...", "severity": "critical"}}
]
"""

PRODUCT_EXPLANATION_PROMPT = """
Bir tarım kooperatifinin {product_name} ürünü hakkında kısa bir operasyonel yorum yap.

Veriler:
- Mevcut stok: {current_stock} {unit}
- Son 30 gün toplam satış: {total_sold_30} {unit}
- Günlük ortalama satış: {daily_avg} {unit}
- Tahmini tükenme: {days_until_stockout} gün
- Tedarik süresi: {lead_time} gün
- Sezon bilgisi: {season_info}
- 7 günlük talep tahmini: {forecast_7d} {unit}

2-3 cümleyle şunları söyle:
1. Mevcut trend (artıyor/azalıyor/stabil)
2. Aciliyet durumu (sipariş gerekiyor mu?)
3. Varsa dikkat edilmesi gereken nokta

Türkçe, doğrudan ve net yaz. "Analiz" veya "Sonuç" gibi başlık koyma.
"""

EMAIL_DRAFT_PROMPT = """
Sen Polatlı Tarım Kooperatifi'nin satınalma sorumlususun.
Aşağıdaki ürünler için tedarikçiye profesyonel bir sipariş maili yaz.

Tedarikçi: {supplier_name}
Tedarikçi email: {supplier_email}
İstenen ürünler:
{items_list}

Beklenen teslim tarihi: {expected_date}

Kurallar:
- "Sayın {supplier_name} Yetkilileri," ile başla
- Her ürün için miktar ve birim açık yazılsın
- Teslim tarihini belirt
- "Dönüşünüzü bekliyoruz" ile bitir
- İmza: "Saygılarımızla,\\nPolatlı Tarım Kooperatifi\\nSatınalma Birimi\\nTel: 0312 XXX XX XX"
- 150-200 kelime
- Sadece mail gövdesini yaz, başka açıklama ekleme
"""