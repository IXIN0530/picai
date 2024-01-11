import torch
import datetime
from diffusers import StableDiffusionPipeline

#モデル設定

model_id="Linaqruf/anything-v3.0"

#GPUチェック
if torch.backends.mps.is_available():
    device="mps"
elif(torch.cuda.is_available()):
    device="cuda"
else:
    device="cpu"

#モデルの読み込み
pipe=StableDiffusionPipeline.from_pretrained(model_id)

#デバイスの設定
pipe=pipe.to(device)

#画像生成
async def generate_image(payload):
    generator_list=[]

    #シード値の設定
    for i in range(payload.count):
        generator_list.append(torch.Generator(device).manual_seed(payload.seedList[i]))

    #画像生成
    images_list=pipe(
        [payload.prompt]*payload.count,
        width=payload.width,
        height=payload.height,
        negative_prompt=[payload.negative]*payload.count,
        guidance_scale=payload.scale,
        num_inference_steps=payload.steps,
        generator=generator_list,
    )

    images=[]
    #画像を保存
    for i, image in enumerate(images_list["images"]):
        file_name=(
            "./outputs/image_"
            +datetime.datetime.now().strftime("%Y%m%d_%H%M%S%f")[:-3]
            +".png"
        )
        image.save(file_name)
        images.append(image)
    return images