$headers = @{ 'apikey' = 'sb_publishable_aAixl5xzC4BfYTL07qOLYQ_SzZVW3qY'; 'Authorization' = 'Bearer sb_publishable_aAixl5xzC4BfYTL07qOLYQ_SzZVW3qY' }
$response = Invoke-RestMethod -Uri 'https://olhfogbudkfkuqqoqjan.supabase.co/rest/v1/products?slug=eq.cesped-esmeralda&select=id,name,price_amount,created_at,updated_at' -Headers $headers
$response | ConvertTo-Json -Depth 5
