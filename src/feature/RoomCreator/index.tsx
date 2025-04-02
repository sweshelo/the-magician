'use client';

import { Button } from '@/component/interface/button';
import { Check } from '@/component/interface/check';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SubmitHandler, useForm } from 'react-hook-form';
import { Tooltip } from 'react-tooltip';
import { useRoomCreator } from './hooks';

interface RoomCreatePayload {
  name: string
  handicap: {
    draw: boolean
    attack: boolean
    cp: boolean
  }
  max: {
    round: number
    field: number
  }
  draw: {
    top: number
    override: number
    mulligan: number
  }
  strictOverride: boolean
  cp: {
    init: number
    increase: number
    max: number
    ceil: number
    carryover: boolean
  }
  player: {
    life: number
    hand: number
    trigger: number
  }
}

export const RoomCreator = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { handleSubmit, roomName, setRoomName } = useRoomCreator();

  const {
    register,
    // handleSubmit,
    // watch,
    // formState: { errors },
  } = useForm<RoomCreatePayload>({
    defaultValues: {
      handicap: {
        draw: true,
        attack: true,
        cp: true,
      },
      max: {
        round: 10,
        field: 5,
      },
      draw: {
        top: 2,
        override: 1,
        mulligan: 4,
      },
      strictOverride: false,
      cp: {
        init: 2,
        increase: 1,
        max: 7,
        ceil: 12,
        carryover: false,
      },
      player: {
        life: 8,
        hand: 7,
        trigger: 4,
      }
    }
  })

  // const onSubmit: SubmitHandler<RoomCreatePayload> = (data) => console.log(data)

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-lg mx-auto">
      <p className="text-center">ルームを作成する</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-1">
          ルーム名
        </label>
        <input
          id="roomName"
          type="text"
          {...register("name")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <details className='border border-gray-300 shadow rounded-lg py-1 px-2'>
          <summary>ルール調整</summary>
          <div className='pl-3'>
            <Check title='先攻1ターン目のドローを無効にする' {...register("handicap.draw")} />
            <Check title='先攻1ターン目のアタックを無効にする' {...register("handicap.attack")} />
            <Check title='後攻1ターン目のCPを規定値から1増やす' {...register("handicap.cp")} />
            <Check title='オーバーライド判定を厳密にする' {...register("strictOverride")} data-tooltip-id={'strict-override'} />
          </div>
        </details>
        <Button>作成</Button>
      </form>
      <Tooltip id='strict-override'>
        <span>
          このオプションを有効にすると、カード名だけでなくバージョン名などもチェック対象となります。<br />
          例えば、PR『見習い魔道士リーナ』・SP『見習い魔道士リーナ』・V1.0『見習い魔道士リーナ』は、<br />
          それぞれ異なるカードであると見なされ、オーバーライドできません。
        </span>
      </Tooltip>
    </div>
  );
};
