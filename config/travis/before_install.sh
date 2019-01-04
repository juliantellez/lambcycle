ENCRYPTED_KEY=$1
ENCRYPTED_IV=$2

if [ -z "$ENCRYPTED_KEY" ] ; then
    echo "[ LOG ] ENCRYPTED_KEY not found - skipping decryption"
    exit 0
fi

if [ -z "$ENCRYPTED_IV" ] ; then
    echo "[ LOG ] ENCRYPTED_IV not found - skipping decryption"
    exit 0
fi

openssl aes-256-cbc \
    -K $ENCRYPTED_KEY \
    -iv $ENCRYPTED_IV \
    -in ./config/travis/id_rsa.enc \
    -out ~/.ssh/id_rsa -d
