const pako = require("pako");

const FactorioBlueprintReader = require("./factorioBlueprintReader");

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
    oil_handling:          '0eNqdmuGO2jAQhN/Fv3OS17GdhFepThWXc1u3EKIQqiKUd29CKKqEW/zdrxN3e5PZ2cUedrmot90p9EPsRrW5qNgeuqPafLqoY/zabXfL78ZzH9RGxTHsVaG67X55dYi7lyF8iV0YzmoqVOzewy+1kem1UKEb4xjDinN9cf7cnfZvYZgD7gjtt7CP7Xb30u+288ML1R+O878duuWZM9SLK9R5/uFn9Pc4hHb9m5mKB1CTD2qSoDYBWmaDShLTJzBtNqb9g5lAcXeU/rTvv2/bH4lEpVoRyueZ+nRVHzD1FVGnKFWZEO4G8bSkdSag6BRiKssmFzHJMVXN5dkZhfBXPMnAkxy85gpXPpdQDKDnpuWdO8bd7W37EFav7TQre2/hQ9cOYQxqefa/4ksYb3LjK8ingnyqD/HRLFxYOCQDtXEs3OeGe1gpDyvlYaU8q5RnlfKsUp5VyrNKeVYpx5RxTBnHlHFMGceUcUwZzbjr+xkNwnNTbRCXBlFpEJMaMakRkxoxuZ0BFQv3LDy3uRwj4xgZx8hYRsYyMpaRKRmZkpEpGRnDyBhGxnyIjGHhgsI1imbY2UcjE12Y6MJEF+gcmOjCblN2mRLRNdJcI8k1UlwjwTXSWxO5NVEbXf6swVl/s/Zm3c2aG/U2am3U2ewIZyc4O8DZ+c2Ob3R6o8Mbnd3s8mZ3N7u6SyR2icQuidglEbskYjPbxlwbM20WiW2R2JaIbYnYlojNDDvz68yuOyS2Q2KjT/fosz36ZM/GNR6liEY7aLCDxjpsdlihFNGcEU0Z0YyRjWtrlGJNUqxJimhg0aAUG5RiQ1JsSIpoOiTMkAtz5IIsuSBPziZyAr0wNMPMDTM7jPywMBsqzIcKMqKCnKggKyrMAQqzgII8oCATKMgFCjNfwtyXIPslyH8JMmDCfI8w48P2GmytwbYacFclzP2wzRZbbLG9FtyeCrNAbNfKVq3/27S+FuuXYDZ/fWemUD/DcFxX+tYaZxpXV2aafgMP5UNA',
    recipes_and_barreling: '0eNq9mNtyozAMht/F1/FMMJDTq+x0OsaIxFNjWNukm+n03VdAG8jiAMmye9UmlfR/liXZ7gdJVAWlkdqRwweRotCWHH58ECuPmqv6O3cpgRyIdJCTFdE8rz8VUlEDmdRgLuRzRaRO4Rc5BJ+rSVduLeSJkvpIcy5OGIKGvRDs82VFQDvpJLQozYfLq67yBAxqXCMpnmDYsrBoW+haEP3pbkUu+COI65io3AZpGA6kNEVaCSfPGJHm+LsCDCGKql4/Stf8f+ixCb14Yb1wQo8trBeN6wULy8XjctHCcpurXAIcq3ukYJhP0pYA6UCrqfMvC8gyuGXCeu5Z+qi201Tx/6faTVOxK5XHfz/pH4y5B+tJ/2jUP/CPp+Eqtm2YLabWgJDNkEq4lYLWjlhlAqzFAUU8qR8mtktr6E1rwOZyMQ8XT89cC9ztf4IWzkQLPWSi4Ioq+bOCjIvGdhmmaPyouN/AN3AnyKVAwFJx1HqQLPKTxY+SxR6yTCqkAmcKBVVOj9zShBsDaiHIzaOQzAMJeYmK79yBWZZu+yBdcC+DtlJZZbBluZDpsoy7Bxmje4w3+fMpdRNTFUdpHS4HC9c67ERsK4veQ7V2eK0bscboFbXQ8mvVXxexa+AU6judM1XTok076CbszaHRenXToLsVeg2joSFNiuLNb921jeHvNJP21LNbr3uWXe2m0ooTN0egKWSgLWBK8sLB1BnG1s9NDzbYPGGqFJqpe38DWfDcRBiqnYCfL1Nq7LnWHqopeTy5KbXwqVb1iFUJ9imvS+S+WPRUz7F5g9Un2BVl2z5UYpGZkY6rtUY7zVsw36+aq5V3owf9592gQfN5MztoOn9KvM2zmZ+U3bykeMe0NzG3w9KL1x0e1nHxRich938D6UXozobBDcM/WHb9Eu02XxhcwGL3OLafjxUPsW7WvwxRuJ5PxDxEhcKdyCpQNDNF3o3HheiC2XTBEC7hzrW35CVQ2GyU6IqyhG43bAT+ycisOsLdcgmifgIqw7XEefL8c6T/VB191ftP+TCaB8888LoSCrhpi8vAo2voP6Pv/AMnngUXeNjeijM38IuCxm485ej9neNHE1yjvay+LfvXuTOOwYZiE0UsZvt4t8Xn9G8CB7xh',
    book: '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'

};