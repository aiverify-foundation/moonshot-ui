import React, { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { createReadteamSession } from '@/actions/createReadteamSession';
import { Icon, IconName } from '@/app/components/IconSVG';
import { FormStateErrorList } from '@/app/components/formStateErrorList';
import { Modal } from '@/app/components/modal';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import { colors } from '@/app/customColors';
import { RunButton } from '@/app/redteaming/(others)/sessions/runButton';
import { useAppSelector } from '@/lib/redux';

const initialFormValues: FormState<RedteamRunFormValues> = {
  formStatus: 'initial',
  formErrors: undefined,
  name: '',
  description: '',
  endpoints: [],
  attack_module: undefined,
};

function RedteamRunForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  // The order of these 2 selectors is important. Test specs rely on this order for mocks.
  const selectedEndpoints = useAppSelector(
    (state) => state.redteamModels.entities
  );
  const attackModule = useAppSelector((state) => state.attackModule.entity);
  const [formState, formAction] = useFormState<
    FormState<RedteamRunFormValues>,
    FormData
  >(createReadteamSession, initialFormValues);

  /*
   figure where to call these if needed (after form refactor)
    dispatch(resetRedteamModels());
    dispatch(resetAttackModule());
    this was previously called after session is created
  */

  useEffect(() => {
    if (formState.formStatus === 'error') {
      setShowErrorModal(true);
      return;
    }
  }, [formState]);

  const disableRunBtn = !name;

  return (
    <>
      {showErrorModal && (
        <Modal
          heading={
            <div className="flex items-center justify-center gap-2">
              <Icon
                name={IconName.Alert}
                size={30}
                color="red"
              />
              <div className="text-lg">Errors</div>
            </div>
          }
          bgColor={colors.moongray['800']}
          textColor="#FFFFFF"
          primaryBtnLabel="Close"
          enableScreenOverlay
          onCloseIconClick={() => setShowErrorModal(false)}
          onPrimaryBtnClick={() => setShowErrorModal(false)}>
          <div className="flex flex-col gap-2 items-start">
            {formState.formErrors && (
              <FormStateErrorList formErrors={formState.formErrors} />
            )}
          </div>
        </Modal>
      )}
      <section className="flex flex-col items-center justify-center min-h-[300px] gap-5">
        <h2 className="text-[1.6rem] font-medium tracking-wide text-white w-full text-center">
          Before you start...
        </h2>
        <div className="flex flex-col w-[50%] gap-2">
          <form action={formAction}>
            {selectedEndpoints.map((endpoint) => (
              <input
                readOnly
                key={endpoint.id}
                type="hidden"
                name="endpoints"
                defaultValue={endpoint.id}
              />
            ))}
            {attackModule && (
              <input
                readOnly
                type="hidden"
                name="attack_module"
                defaultValue={attackModule.id}
              />
            )}
            <TextInput
              name="name"
              label="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              error={formState.formErrors?.name?.[0]}
              labelStyles={{
                fontSize: '1rem',
                color: colors.moonpurplelight,
              }}
              inputStyles={{ height: 38 }}
              placeholder="Give this session a unique name"
            />

            <TextArea
              name="description"
              label="Description (optional)"
              labelStyles={{
                fontSize: '1rem',
                color: colors.moonpurplelight,
              }}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              error={formState.formErrors?.description?.[0]}
              placeholder="Describe this session. E.g., purpose of the session"
            />

            <div className="flex grow gap-2 justify-center items-end mt-10">
              <RunButton disabled={disableRunBtn} />
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export { RedteamRunForm };
