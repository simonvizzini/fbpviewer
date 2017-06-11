var FactorioBlueprintReader = FactorioBlueprintReader || {};

FactorioBlueprintReader.parse = function (blueprintString) {
    var version = blueprintString[0];
    blueprintString = blueprintString.substr(1);
    blueprintString = atob(blueprintString); // base64 decode
    blueprintString = pako.inflate(blueprintString, {to: 'string'});
    var blueprintData = JSON.parse(blueprintString);
    return {data: blueprintData, version: version};
};

FactorioBlueprintReader.stringify = function (blueprintData) {
    var blueprintString = JSON.stringify(blueprintData.data);
    blueprintString = pako.deflate(blueprintString, {to: 'string'});
    blueprintString = btoa(blueprintString); // base64 encode
    return blueprintData.version + blueprintString;
};

FactorioBlueprintReader.TEST_CASES = {
    radar:                 '0eNqVkt0KwyAMhd8l1xZs6Q/4KmMMu4ZNaGNRO1aK7z51Y4zCxrwJJJx8Ho7ZoB8XnI0iB2IDddZkQRw2sOpCcowzt84IApTDCRiQnGJn5CANeAaKBryDKP2RAZJTTuETkJr1RMvUowmC3SqDWdug1hTfCATOYA3VR5BT44uyExVlUhWlf+Os04TFLN012Pm2wDP1f/N5ph+eZ4fnuclNJzOcn9mEb0snIj4uisENjU2Atq6rpmvqtuq8fwCvb8se',
    bpr:                   '0eNqdmN1qg0AQRt9lri3sOro/vkrJRZouZcGoRFsaxHevNgR60RZPrkKSL8O3M2cms87y0r6n4ZK7SZpZ8qnvRmmeZxnzW3dst8+m65CkkTylsxTSHc/bu1V3uqQpyVJI7l7TpzR2ORQy5TbdAgz9mKfcd1uI9dsnWxZyXV/98luQv/UO6muor6Beob6Eesv0hslhdGge5gamHlYWgrObSws5tiy8geENw8AgN5GZiQzhiKxHBHBE5wxs1gTW2gE5D4hez6aeZ0PPs5nn0dDwqKsdmjAODRhlmCujRVmJlJVIWYmUoausoxV1tKK+UASXIlz0AVxYPRkse0mEOxVcGeA/EQnO/uUMotCi9rSoIdiSyVZMtmA6lEGHcuLQKR06pXvklCVSW6I2RIwiI9MoHyjVqIoIkJ3seUSqJ1XxpCoB+QjER+A+dtLBNnC2gEdC3v1i4pi8RPKdYN/vYDWTw+iK5Hu9oMvpf3fTQ3F7JtP8eIRTyEe6jN+/d1VV1r6uXOmX5QsHn63x',
    depot:                 '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',
    circuitry:             '0eNqdlNtuwjAMht/Fl1NB9ARSL/YiE6p68MBSk1RpCkMo7z4njK4bLbDdVHXqw/9/jnqGsumx1SQNZGegSskOsrczdLSTRePOzKlFyIAMCghAFsJFrTqiXnRHMtUebAAka/yALLTBw9JCk9kLNFQtKiVKkoVRetQjstsAUBoyhBctPjjlshclah4yrSLgsOMiJd1obrRYLdMATvwSLVPuz94kVi6hcxmhe+w0ohwPoRqymHNJVz0ZH4Z2a60z9ktHNOhw1EwhzdjQrZzYi1nNKNFY/1NHPOiosaKaidyTEV2QrK5IjFZNXuK+OBCnc85Xk5y/1TRovFpkA65MtIX2/TN4BXfQnriglyZ/10rkJNueU43u0T7v129+ciPOegDR7MaSn6SiGVLJg0t4u7PQ0wpnYX33ucdLtci0fFt4gT8QSWeJTDj+A6BwBGfips3xSwd+AmvqxQIbNqEZYqsavMV3oRc/7zeZuvGMwP9BstG/KoAD6s5PWidJlG7SZB1trP0EX86kWw==',
    connected_combinators: '0eNrNlttuozAQht9lLldOFRwOCRf7IqsKcZimI4FBxlSNIt69Y0i7KCUJVtWmNyDD+PfM598jHyErO2w0KQPxESivVQvxvyO0tFdpab+ZQ4MQAxmsQIBKKztKNZnnCg3lq7yuMlKpqTX0AkgV+Aqx14ubGgXmVKCeF5D9owBUhgzhmNEwOCSqqzLUvMKNXAQ0dcuza2UTYMXVRsDBvh4CXoYLNboukwyf0xfieA76L5Tw72KY3NoflopJLaK1gLpBnY668Af6UUth/hHt2YfGYpo18UhyJOm8IzMMvf6R50obvNeI6jzc/xzeW6pnHKQzB+8hOJHg9QvSY+pjfj9PxfsWKhtXKpeghHeBsvsSFHkBiu8KZT09MRMo/vdDma1TntcprllJ3qC2WUYt+KCW0X6FJWeqmVtTlzhzuIJ3H63f28yy0sJlyYTXuuellicvdryTyLXtYv0m1YN+DH/BfmgOPKFTJnnSdZWQajoONbpDB4dHbg4PzrY6WtYGIjdc69PmLWuM94MXfqpeLHbVifKM6naZBbdOTOXEgbc7yA8hnWW1c2EVLWO1c2Llz9sv/G3227id3e3cWWXHDrfBeHIBFfCCuh1r9n0ZRIEfyqjv3wB4jaiH',
    oil_handling:          '0eNqdmuGO2jAQhN/Fv3OS17GdhFepThWXc1u3EKIQqiKUd29CKKqEW/zdrxN3e5PZ2cUedrmot90p9EPsRrW5qNgeuqPafLqoY/zabXfL78ZzH9RGxTHsVaG67X55dYi7lyF8iV0YzmoqVOzewy+1kem1UKEb4xjDinN9cf7cnfZvYZgD7gjtt7CP7Xb30u+288ML1R+O878duuWZM9SLK9R5/uFn9Pc4hHb9m5mKB1CTD2qSoDYBWmaDShLTJzBtNqb9g5lAcXeU/rTvv2/bH4lEpVoRyueZ+nRVHzD1FVGnKFWZEO4G8bSkdSag6BRiKssmFzHJMVXN5dkZhfBXPMnAkxy85gpXPpdQDKDnpuWdO8bd7W37EFav7TQre2/hQ9cOYQxqefa/4ksYb3LjK8ingnyqD/HRLFxYOCQDtXEs3OeGe1gpDyvlYaU8q5RnlfKsUp5VyrNKeVYpx5RxTBnHlHFMGceUcUwZzbjr+xkNwnNTbRCXBlFpEJMaMakRkxoxuZ0BFQv3LDy3uRwj4xgZx8hYRsYyMpaRKRmZkpEpGRnDyBhGxnyIjGHhgsI1imbY2UcjE12Y6MJEF+gcmOjCblN2mRLRNdJcI8k1UlwjwTXSWxO5NVEbXf6swVl/s/Zm3c2aG/U2am3U2ewIZyc4O8DZ+c2Ob3R6o8Mbnd3s8mZ3N7u6SyR2icQuidglEbskYjPbxlwbM20WiW2R2JaIbYnYlojNDDvz68yuOyS2Q2KjT/fosz36ZM/GNR6liEY7aLCDxjpsdlihFNGcEU0Z0YyRjWtrlGJNUqxJimhg0aAUG5RiQ1JsSIpoOiTMkAtz5IIsuSBPziZyAr0wNMPMDTM7jPywMBsqzIcKMqKCnKggKyrMAQqzgII8oCATKMgFCjNfwtyXIPslyH8JMmDCfI8w48P2GmytwbYacFclzP2wzRZbbLG9FtyeCrNAbNfKVq3/27S+FuuXYDZ/fWemUD/DcFxX+tYaZxpXV2aafgMP5UNA'

};