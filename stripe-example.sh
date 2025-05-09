# Basic product test
stripe products create \
  --name="Basic test product 0003" \
  --description="Basic Test Product Description" \
  -d "metadata[features]={ \"maxDocuments\": { \"type\": \"METERED\", \"metadata\": { \"max\": 5000 } }, \"teamLimit\": { \"type\": \"METERED\", \"metadata\": { \"max\": 1 } } }" \
  -d "metadata[type]=plan"

# Create a price for the product (replace {product_id} with the ID from above)
stripe prices create \
  --product=prod_SGGWMNBqWfWp8Q \
  --unit-amount=1000 \
  --currency=usd \
  -d "recurring[interval]=month"

stripe prices create \
  --product=prod_SGGWMNBqWfWp8Q \
  --unit-amount=9600 \
  --currency=usd \
  -d "recurring[interval]=year"


# Professional product test
stripe products create \
  --name="Professional test product" \
  --description="Professional Test Product Description" \
  -d "metadata[features]={ \"maxDocuments\": { \"type\": \"METERED\", \"metadata\": { \"max\": 10000 } }, \"prioritySupport\": { \"type\": \"DEFAULT\" }, \"canExport\": { \"type\": \"DEFAULT\" }, \"teamLimit\": { \"type\": \"METERED\", \"metadata\": { \"max\": 5 } } }" \
  -d "metadata[type]=plan"

# Create a price for the product (replace {product_id} with the ID from above)
stripe prices create \
  --product=prod_SFuaHGu57t0CQb \
  --unit-amount=100000 \
  --currency=usd \
  -d "recurring[interval]=month"

stripe prices create \
  --product=prod_SFuaHGu57t0CQb \
  --unit-amount=960000 \
  --currency=usd \
  -d "recurring[interval]=year"


# Create a test addon
stripe products create \
  --name="Test Addon" \
  --description="Test Addon Description" \
  -d "metadata[features]={ \"maxDocuments\": { \"type\": \"METERED\", \"metadata\": { \"max\": 20000 } } }" \
  -d "metadata[type]=addon"

stripe prices create \
  --product=prod_SFtNPquA8IaKhh \
  --unit-amount=100000 \
  --currency=usd \
  -d "recurring[interval]=month"


stripe products create \
  --name="Test Addon 2" \
  --description="Test Addon 2 Description" \
  -d "metadata[features]={ \"prioritySupport\": { \"type\": \"DEFAULT\" } }" \
  -d "metadata[type]=addon"