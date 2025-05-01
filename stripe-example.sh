# Basic product test
stripe products create \
  --name="Basic" \
  --description="Basic Test Product Description" \
  -d "metadata[features]={ \"maxDocuments\": 1000, \"prioritySupport\": false, \"canExport\": false, \"teamLimit\": 1 }"

# Create a price for the product (replace {product_id} with the ID from above)
stripe prices create \
  --product=prod_SEWMtQ3gx3z2Wr \
  --unit-amount=1000 \
  --currency=usd \
  -d "recurring[interval]=month"

stripe prices create \
  --product=prod_SEWMtQ3gx3z2Wr \
  --unit-amount=9600 \
  --currency=usd \
  -d "recurring[interval]=year"


# Professional product test
stripe products create \
  --name="Professional" \
  --description="Professional Test Product Description" \
  -d "metadata[features]={ \"maxDocuments\": 10000, \"prioritySupport\": true, \"canExport\": true, \"teamLimit\": 5 }"

# Create a price for the product (replace {product_id} with the ID from above)
stripe prices create \
  --product=prod_SEWNRuAZpfHfw0 \
  --unit-amount=100000 \
  --currency=usd \
  -d "recurring[interval]=month"

stripe prices create \
  --product=prod_SEWNRuAZpfHfw0 \
  --unit-amount=960000 \
  --currency=usd \
  -d "recurring[interval]=year"